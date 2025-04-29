import { useParams, Link, useNavigate } from "react-router-dom";
import { GoBack } from "../../../components/elements";

const TrustEstablishment = () => {
  const { name, id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="py-4 px-7">
      <GoBack action={() => navigate(-1)} trustName={name || ""} />

      <div className="my-7 flex items-center justify-between">
        <h2 className="font-semibold text-xl text-black capitalize">{name}</h2>

        <Link to={`/trust/${name}/${id}/trust-establishment/update`}>
          <button className="px-3 py-2 rounded-md border border-black text-black font-medium text-sm">
            Edit Component
          </button>
        </Link>
      </div>

      <section>
        <div>jkbkjbk</div>

        <div></div>
      </section>
    </div>
  );
};

export default TrustEstablishment;
