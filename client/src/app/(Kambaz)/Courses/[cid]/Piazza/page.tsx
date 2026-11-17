import Link from "next/link";

export default function Piazza() {
  return (
    <div id="wd-piazza">
      <h1>Piazza Page</h1>
      <p>
        Welcome! Click the button to go to Piazza (while we wait to work on
        our own version).
      </p>
      <Link href="https://piazza.com" id="wd-course-piazza-link">
        <button className="btn btn-primary">Piazza </button>
      </Link>
    </div>
  );
}
