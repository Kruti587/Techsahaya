import SignInForm from "@/components/ui/sign-in-form";
import { useAppContext } from "@/context/AppContext";
import { t } from "@/utils/i18n";

export function LoginPage() {
  const { language } = useAppContext();

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-5xl items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-4xl gap-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-card lg:grid-cols-[1.1fr_1.3fr] items-center">
        <div className="rounded-3xl bg-sahaya-green p-8 text-white h-full flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sahaya-saffron">
              {t(language, "citizenPortal")}
            </span>
            <h1 className="text-3xl font-bold font-serif mt-2">
              {t(language, "welcomeToSahaya")}
            </h1>
            <p className="mt-3 text-emerald-50 text-sm leading-relaxed">
              {t(language, "welcomePortalDesc")}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
