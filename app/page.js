import SettingsForm from "@/components/SettingsForm";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-12">
      <header className="mb-8">
        <p className="text-sm font-medium tracking-wide text-teal-800 uppercase">
          Account
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
          User settings
        </h1>
        <p className="mt-2 text-stone-600">
          Update your profile details. Required fields are marked with an
          asterisk. Password is optional unless you want to change it.
        </p>
      </header>
      <SettingsForm />
    </main>
  );
}
