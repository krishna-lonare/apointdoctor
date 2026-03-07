import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BookingForm from '../components/BookingForm';
import StatusCheck from '../components/StatusCheck';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Hero />
        <BookingForm />
        <StatusCheck />
      </main>
      <Footer />
    </>
  );
}
