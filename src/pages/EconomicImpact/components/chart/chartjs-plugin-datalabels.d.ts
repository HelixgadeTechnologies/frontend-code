// filepath: src/types/chartjs-plugin-datalabels.d.ts
import "chart.js";

declare module "chart.js" {
  interface PluginOptionsByType<TType extends ChartType> {
    datalabels?: {
      formatter?: (value: number, context: any) => string;
      color?: string;
      font?: {
        weight?: string;
      };
    };
  }
}