import PropTypes from "prop-types";

VideoPlayer.propTypes = {
  stream: PropTypes.object,
  className: PropTypes.string,
};

export function VideoPlayer({ stream, className = "" }) {
  return (
    <video
      ref={(el) => {
        if (el) {
          el.srcObject = stream;
        }
      }}
      className={`w-full h-full object-cover object-center ${className}`}
      controls={false}
      autoPlay
      playsInline
      muted
    ></video>
  );
}
