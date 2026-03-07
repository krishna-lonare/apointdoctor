export default function Footer() {
  return (
    <footer className="footer">
      <div className="container text-center">
        <p>&copy; {(new Date()).getFullYear()} ApointDoctor. All rights reserved.</p>
      </div>
    </footer>
  );
}
