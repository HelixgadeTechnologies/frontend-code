import { useParams, Link } from "react-router-dom";
import { GoBack } from "../../components/elements";

const UpdateTrustEstablishment = () => {
  const { name, id } = useParams();

  return (
    <div className="py-4 px-7">
      <GoBack page="Trust Establishment" trustName={name || ""} />

      <div className="my-7 flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-black capitalize">
          Trust Establishment and Governance <br /> Structure Dashboard
        </h2>

        <Link to={`/trust/${name}/${id}`}>
          <button className="px-3 py-2 rounded-md border border-black text-black font-medium text-sm">
            Back to Dashbaord
          </button>
        </Link>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6">
          <h2 className="font-semibold text-xl text-black capitalize">
            Trust Establishment Status{" "}
          </h2>
          <p className="text-base text-[#8C94A6]">
            These are your personal details, they are visible to the public{" "}
          </p>
        </div>

        <div className="bg-white p-6">b</div>
      </section>
    </div>
  );
};

export default UpdateTrustEstablishment;
