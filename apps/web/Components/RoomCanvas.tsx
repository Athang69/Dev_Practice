export default function RoomCanvas(){
  return (
    <div className="relative w-full h-screen">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 z-0 bg-white w-full h-full"
      />

      <div className="absolute top-4 left-[200px] z-10">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setShape("circle")}
        >
          Circle
        </button>
      </div>

      <div className="absolute top-4 left-[300px] z-10 ">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setShape("rect")}
        >
          Rectangle
        </button>
      </div>

      <div className=" absolute top-4 left-[430px] z-10">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setShape("line")}
        >
          Line
        </button>
      </div>

       <div className=" absolute top-4 left-[520px] z-10">
        <button
          className="px-4 py-2 bg-pink-500 text-white rounded"
          onClick={() => setShape("arrow")}
        >
          Arrow
        </button>
      </div>
      
      <div className=" absolute top-4 left-[620px] z-10">
        <button
          className="px-4 py-2 bg-cyan-500 text-white rounded"
          onClick={() => setShape("pencil")}
        >
          Pencil
        </button>
      </div>

      <div className=" absolute top-4 left-[720px] z-10 text-black">
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded"
          onClick={() => setShape("text")}
        >
          Text
        </button>
      </div>

    </div>
  );
}