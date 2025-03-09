export default function Home() {
  return (
    <div className="bg-gray-100 flex flex-col h-full">
      <section className="py-12 bg-white h-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Данные о перевозках
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md min-h-[400px] flex items-center justify-center">
            <p className="text-gray-500">
              Здесь будет ваша таблица (добавьте через библиотеку)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
