import "./globals.css";

export const metadata = {
  title: "Account settings",
  description: "Update your profile, email, and password.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
