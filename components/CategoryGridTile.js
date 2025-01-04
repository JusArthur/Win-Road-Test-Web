export default function CategoryGridTile({ location, onClick, imgUrl }) {
    return (
      <div className="rounded-2xl mx-4 my-2 overflow-hidden shadow-lg">
        <button
          className="block w-full"
          onClick={onClick}
        >
          <div
            className="w-full h-32 bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${imgUrl})` }}
          >
            <div className="bg-black/40 p-4 rounded-2xl text-center">
              <h3 className="text-xl font-bold text-white">{location}</h3>
            </div>
          </div>
        </button>
      </div>
    );
  }
  