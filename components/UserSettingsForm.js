"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultUserSettings,
  NOTIFICATION_OPTIONS,
  userSettingsSchema,
} from "@/lib/userSettingsSchema";

async function defaultSave() {
  await new Promise((resolve) => setTimeout(resolve, 400));
}

export default function UserSettingsForm({
  defaultValues = defaultUserSettings,
  onSubmit,
}) {
  const save = onSubmit ?? defaultSave;
  const [saveState, setSaveState] = useState("idle");
  const [saveError, setSaveError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSettingsSchema),
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  async function onValid(values) {
    setSaveError("");
    setSaveState("saving");

    try {
      await save(values);
      setSaveState("success");
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Could not save settings. Please try again.";
      setSaveError(message);
      setSaveState("error");
    }
  }

  function onInvalid(formErrors) {
    setSaveState("idle");
    setSaveError("");
    const firstId = formErrors.name ? "name" : formErrors.email ? "email" : null;
    if (firstId) {
      document.getElementById(firstId)?.focus();
    }
  }

  const inputClass = (invalid) =>
    `mt-1 w-full rounded-lg border bg-white px-3 py-2 text-stone-900 shadow-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-stone-100 ${
      invalid
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-stone-300 focus:border-teal-600 focus:ring-teal-200"
    }`;

  const formMessageId =
    saveState === "error"
      ? "settings-form-error"
      : saveState === "success"
        ? "settings-form-success"
        : undefined;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onValid, onInvalid)}
      aria-label="User settings form"
      aria-describedby={formMessageId}
      aria-busy={isSubmitting}
      className="rounded-2xl border border-stone-200 bg-[var(--card)] p-6 shadow-sm"
    >
      {saveState === "error" ? (
        <p
          id="settings-form-error"
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {saveError}
        </p>
      ) : null}

      {saveState === "success" ? (
        <p
          id="settings-form-success"
          role="status"
          aria-live="polite"
          className="mb-5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900"
        >
          Settings saved. Your preferences are up to date.
        </p>
      ) : null}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-800">
            Name
            <span className="ml-0.5 text-red-700" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            spellCheck="false"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : "name-hint"}
            className={inputClass(Boolean(errors.name))}
            {...register("name")}
          />
          {errors.name ? (
            <p id="name-error" role="alert" className="mt-1 text-sm text-red-700">
              {errors.name.message}
            </p>
          ) : (
            <p id="name-hint" className="mt-1 text-xs text-stone-500">
              Your display name, 2–80 characters.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-800">
            Email
            <span className="ml-0.5 text-red-700" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : "email-hint"}
            className={inputClass(Boolean(errors.email))}
            {...register("email")}
          />
          {errors.email ? (
            <p id="email-error" role="alert" className="mt-1 text-sm text-red-700">
              {errors.email.message}
            </p>
          ) : (
            <p id="email-hint" className="mt-1 text-xs text-stone-500">
              We will use this address for account notices.
            </p>
          )}
        </div>

        <fieldset
          disabled={isSubmitting}
          aria-describedby="notifications-hint"
          className="rounded-lg border border-stone-200 px-3 py-3 disabled:opacity-70"
        >
          <legend className="px-1 text-sm font-medium text-stone-800">
            Notification preferences
          </legend>
          <p id="notifications-hint" className="mb-3 text-xs text-stone-500">
            Choose which emails you want to receive. You can turn all of them
            off.
          </p>
          <div className="space-y-3">
            {NOTIFICATION_OPTIONS.map((option) => {
              const optionId = `notifications-${option.name}`;
              const descriptionId = `${optionId}-description`;

              return (
                <label
                  key={option.name}
                  htmlFor={optionId}
                  className="flex cursor-pointer items-start gap-3 text-sm text-stone-700"
                >
                  <input
                    id={optionId}
                    type="checkbox"
                    disabled={isSubmitting}
                    aria-describedby={descriptionId}
                    className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-teal-700"
                    {...register(`notifications.${option.name}`)}
                  />
                  <span>
                    <span className="font-medium text-stone-800">
                      {option.label}
                    </span>
                    <span
                      id={descriptionId}
                      className="mt-0.5 block text-xs text-stone-500"
                    >
                      {option.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          className="inline-flex min-w-36 items-center justify-center rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:bg-teal-800 disabled:opacity-80"
        >
          {isSubmitting ? (
            <>
              <span
                className="mr-2 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
              Saving…
            </>
          ) : (
            "Save settings"
          )}
        </button>
      </div>
    </form>
  );
}
