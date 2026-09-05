import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
import httpx
from app.services.discord_service import DiscordNotificationService


def test_discord_startup_disabled_when_credentials_missing():
    """Startup with Discord disabled (no token or channel)."""
    async def run():
        service = DiscordNotificationService()
        service.start(token="", channel_id="")
        assert service.client is None
        # Calling send_admin_notification should be a safe no-op and never throw
        await service.send_admin_notification("Test Title", "Test Message")
        await service.close()

    asyncio.run(run())


def test_discord_startup_configured():
    """Startup with Discord configured creates an AsyncClient with correct base URL."""
    async def run():
        service = DiscordNotificationService()
        service.start(token="test_bot_token_xyz", channel_id="123456789012345678")
        assert service.client is not None
        assert str(service.client.base_url) == "https://discord.com/api/v10/"
        await service.close()

    asyncio.run(run())


def test_discord_successful_notification_delivery():
    """Successful notification delivery posts embed to the channel endpoint."""
    async def run():
        service = DiscordNotificationService()
        service.start(token="test_bot_token_xyz", channel_id="999888777")

        mock_post = AsyncMock()
        mock_response = MagicMock()
        mock_response.raise_for_status = MagicMock()
        mock_post.return_value = mock_response

        with patch.object(service.client, "post", mock_post):
            await service.send_admin_notification(
                title="🚨 SYSTEM HEALTH ALERT",
                message="Database pool healthy",
                event_type="success",
                metadata={"environment": "production", "status_code": "200"}
            )
            mock_post.assert_called_once()
            call_args, call_kwargs = mock_post.call_args
            assert call_args[0] == "/channels/999888777/messages"
            payload = call_kwargs["json"]
            assert "embeds" in payload
            embed = payload["embeds"][0]
            assert embed["title"] == "🚨 SYSTEM HEALTH ALERT"
            assert embed["description"] == "Database pool healthy"
            assert embed["color"] == 0x2ecc71  # Green for success
            assert len(embed["fields"]) == 2

        await service.close()

    asyncio.run(run())


def test_discord_timeout_and_api_failure_handling():
    """Discord API failures, timeouts, or 500 errors must NEVER raise or crash callers."""
    async def run():
        service = DiscordNotificationService()
        service.start(token="test_bot_token_xyz", channel_id="999888777")

        # 1. Simulate httpx TimeoutException
        with patch.object(service.client, "post", AsyncMock(side_effect=httpx.TimeoutException("Discord timeout"))):
            # Must catch cleanly without raising
            await service.send_admin_notification("Timeout Alert", "Will timeout")

        # 2. Simulate Discord 404 / 500 HTTPStatusError
        mock_bad_resp = MagicMock()
        mock_bad_resp.raise_for_status.side_effect = httpx.HTTPStatusError("500 Discord Server Error", request=MagicMock(), response=mock_bad_resp)
        with patch.object(service.client, "post", AsyncMock(return_value=mock_bad_resp)):
            await service.send_admin_notification("Server Error Alert", "Will fail 500")

        await service.close()

    asyncio.run(run())


def test_discord_shutdown_cleanup():
    """Client is properly closed upon application shutdown."""
    async def run():
        service = DiscordNotificationService()
        service.start(token="test_bot_token_xyz", channel_id="999888777")
        assert service.client is not None
        assert not service.client.is_closed
        await service.close()
        assert service.client.is_closed

    asyncio.run(run())
