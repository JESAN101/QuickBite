import FoodCard from "./FoodCard";

const Foods = ({ foods }) => {
  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <h2 className="text-3xl font-bold mb-8">
        Popular Foods
      </h2>

      {foods.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-xl">
          No foods found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {foods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
            />
          ))}

        </div>
      )}

    </section>
  );
};

export default Foods;