import { Link } from "react-router-dom";
import { facebookUrl } from "../config";

export default function Footer() {
    return (<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-6 mb-6">
        <Link to="/privacy" className="flex items-center gap-2 hover:underline hover:underline-offset-4">
          🔒 Privacy
        </Link>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          🌐 Join us on Facebook →
        </a>
        <img src="/static/api_logo_pwrdBy_strava_horiz_gray.svg" alt="Powered by Strava" className="flex items-center gap-2" width={180} />
      </footer>);
}