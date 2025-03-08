const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} АКОС.</p>
      </div>
    </footer>
  );
};

export { Footer };
