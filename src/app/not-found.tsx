export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl text-foreground/70">Oops! Page not found</p>
        <a href="/" className="inline-block text-primary hover:underline">
          Return to Home
        </a>
      </div>
    </div>
  );
}
