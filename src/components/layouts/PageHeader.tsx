import { ReactNode } from "react";
import { Button } from "../elements";

interface HeaderType {
  title: string;
  desc: string;
  ctaText: string;
  iconLeft?: ReactNode;
  action?: () => void;
}

const PageHeader = ({ title, desc, ctaText, action, iconLeft }: HeaderType) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4">
      <div>
        <h2 className="text-lg lg:text-2xl font-semibold text-primary-100">
          {title}
        </h2>
        <p className="mt-1 text-xs text-gray-4">{desc}</p>
      </div>

      <div>
        <Button
          onClick={action}
          iconLeft={iconLeft}
          padding="py-2 px-6"
          buttonText={ctaText}
        />
      </div>
    </div>
  );
};

export default PageHeader;
