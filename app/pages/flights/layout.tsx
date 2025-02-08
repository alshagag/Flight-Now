export default function FlightsLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <header>Flights Page</header>
        <main>{children}</main>
      </div>
    );
  }
  