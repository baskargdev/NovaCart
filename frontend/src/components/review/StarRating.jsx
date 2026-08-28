import { Star } from "lucide-react";

const StarRating = ({ rating = 0, setRating, editable = false, size = 28 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`transition ${
            editable ? "cursor-pointer" : "cursor-default"
          } ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => {
            if (editable && setRating) {
              setRating(star);
            }
          }}
        />
      ))}
    </div>
  );
};

export default StarRating;
