import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-center text-xl font-bold text-brand-600">Smart Route Optimizer</h1>
        <p className="mb-6 text-center text-sm text-gray-500">Sign in to continue</p>
        <LoginForm />
      </div>
    </div>
  );
}
