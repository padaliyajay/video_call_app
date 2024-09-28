import PropTypes from "prop-types";

MessageCard.propTypes = {
  text: PropTypes.string.isRequired,
  is_you: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export function MessageCard({ text, is_you, className = "", ...props }) {
  className =
    (is_you ? "bg-white rounded-ee-none " : "bg-white rounded-ss-none ") +
    className;

  return (
    <div
      className={`inline-block py-2 px-4 border border-gray-300 rounded-xl flex-shrink-0 font-medium text-gray-900 ${className}`}
      {...props}
    >
      {text}
    </div>
  );
}
