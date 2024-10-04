import Image from "next/image";
import heroImage from "../public/images/hero-image.jpg";
import Link from "next/link";

export default function Home() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row">
        <Image
          src={heroImage}
          className="max-w-sm rounded-lg shadow-2xl"
          alt="hero-image"
        />
        <div>
          <h1 className="text-5xl font-bold">Events Booker!</h1>
          <p className="py-6">
            Ready to plan your next event? Log in or create an account to easily
            book your event and unlock all the features we offer, including
            managing your bookings, receiving emails, and more!
          </p>
          <Link href="/login">
            <button className="btn btn-primary">
              Login or Create an account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
