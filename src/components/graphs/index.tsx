import React, { PureComponent } from "react";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface GraphsDataProps {
  data: { name: string; value: number; fill?: string }[];
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  fill?: string;
}

class GraphsData extends PureComponent<GraphsDataProps> {
  render() {
    const { data, width, height } = this.props;
    const fixedProps = {
      width: 400,
      height: 400,
      cx: 500,
      cy: 200,
      innerRadius: 40,
      outerRadius: 80,
    };

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={width} height={height}>
          <Pie
            dataKey="value"
            data={data}
            cx={fixedProps.cx}
            cy={fixedProps.cy}
            innerRadius={fixedProps.innerRadius}
            outerRadius={fixedProps.outerRadius}
            fill={(entry) => entry.fill || fixedProps.fill || "#82ca9d"}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

export default GraphsData;
