export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Регистрация закрыта</h1>
        <p className="text-gray-600 mb-6">В настоящее время регистрация новых пользователей не осуществляется.</p>
        <a href="/auth/login" className="text-black font-medium hover:underline">
          Перейти к входу
        </a>
      </div>
    </div>
  );
}
