import { Button } from "../elements";

interface HeaderType {
  title: string;
  desc: string;
  ctaText: string;
  action?: () => void;
}

const PageHeader = ({ title, desc, ctaText, action }: HeaderType) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg lg:text-2xl font-semibold text-primary-100">
          {title}
        </h2>
        <p className="mt-1 text-xs text-gray-4">{desc}</p>
      </div>

      <div>
        <Button onClick={action} padding="py-2 px-6" buttonText={ctaText} />
      </div>
    </div>
  );
};

export default PageHeader;
