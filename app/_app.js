import Link from 'next/link';
import '../styles/globals.css';


function MyApp({ Component, pageProps }) {
    return (
    <>
    <nav className='navBar'>
    <Link href="/flights">Flights</Link>
    <Link href="/hotels">Hotels</Link>
    <Link href="/about">About</Link>
    <Link href="/contact">Contact Us</Link>
</nav>
    <Component {...pageProps}/>
    </>
    );
}

export default MyApp;
