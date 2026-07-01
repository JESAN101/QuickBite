const Hero = () => {
  return (
    <section className="bg-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">

        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Delicious Food,
          <br />
          Delivered To Your Door
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-2xl">
          Order your favorite meals from the best restaurants in your city.
          Fast delivery, fresh food, and secure online payment.
        </p>

        <button className="mt-10 bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-orange-100 transition">
          Order Now
        </button>

      </div>
    </section>
  );
};

export default Hero;