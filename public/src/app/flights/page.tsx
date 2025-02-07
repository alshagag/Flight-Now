// src/app/page.tsx

"use client"; // To enable event handling in React
import Image from "next/image";

import React, { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: 1,
  });

  // Processing change in inputs.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const { name, value } = e.target; // Specify the name and value of the input.
    setFormData({ ...formData, [name]: value });
  };

  // Process form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // Display form data.
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="from">From:</label>
        <input
          id="from"
          name="from" // Specify the name for the input.
          type="text"
          value={formData.from}
          onChange={handleInputChange} // Bind the change function
        />
      </div>
      <div>
        <label htmlFor="to">To:</label>
        <input
          id="to"
          name="to" // Specify the name for the input.
          type="text"
          value={formData.to}
          onChange={handleInputChange} // Linking the change function

        />
      </div>
      <div>
        <label htmlFor="departureDate">Departure Date:</label>
        <input
          id="departureDate"
          name="departureDate"
          type="date"
          value={formData.departureDate}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
