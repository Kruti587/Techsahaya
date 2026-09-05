import logging
import asyncio
from typing import Any
import httpx
from app.core.config import get_settings

logger = logging.getLogger("techsahaya.discord_service")
settings = get_settings()

class DiscordNotificationService:
    def __init__(self):
        self.client: httpx.AsyncClient | None = None
        self.token = settings.discord_bot_token.strip()
        self.channel_id = settings.discord_admin_channel_id.strip()

    def start(self, token: str | None = None, channel_id: str | None = None):
        """Called on application startup."""
        cfg = get_settings()
        self.token = (token if token is not None else cfg.discord_bot_token).strip()
        self.channel_id = (channel_id if channel_id is not None else cfg.discord_admin_channel_id).strip()
        if not self.token or not self.channel_id:
            logger.info("Discord admin notifications are disabled (missing token or channel ID).")
            self.client = None
            return

        # We configure httpx with a timeout so discord latency doesn't hang our processes
        self.client = httpx.AsyncClient(
            base_url="https://discord.com/api/v10",
            headers={"Authorization": f"Bot {self.token}", "Content-Type": "application/json"},
            timeout=10.0
        )
        logger.info("Discord notification service started.")

    async def close(self):
        """Called on application shutdown."""
        if self.client:
            await self.client.aclose()
            logger.info("Discord notification service stopped.")

    async def send_admin_notification(self, title: str, message: str, event_type: str = "info", metadata: dict[str, Any] | None = None):
        """
        Sends an embed notification to the configured Discord admin channel.
        Failures are caught and logged to prevent breaking the main application flow.
        """
        if not self.client or not self.channel_id:
            return

        embed = {
            "title": title,
            "description": message,
            "color": self._get_color_for_event(event_type),
        }
        
        if metadata:
            fields = []
            for k, v in metadata.items():
                fields.append({"name": str(k), "value": str(v), "inline": True})
            if fields:
                embed["fields"] = fields

        payload = {
            "embeds": [embed]
        }

        try:
            response = await self.client.post(f"/channels/{self.channel_id}/messages", json=payload)
            response.raise_for_status()
        except Exception as e:
            logger.exception("Discord admin notification failed: %s", e)

    def _get_color_for_event(self, event_type: str) -> int:
        # standard Discord colors
        colors = {
            "info": 0x3498db,      # Blue
            "warning": 0xf1c40f,   # Yellow
            "error": 0xe74c3c,     # Red
            "success": 0x2ecc71,   # Green
            "scheme_added": 0x9b59b6, # Purple
        }
        return colors.get(event_type, colors["info"])

discord_service = DiscordNotificationService()
