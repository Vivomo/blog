import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RollerShutterCalc() {
  const [calcType, setCalcType] = useState<string>("1");
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [thickness, setThickness] = useState<number>(0.8);
  const [curtainPrice, setCurtainPrice] = useState<number>(0);
  const [shaftPrice, setShaftPrice] = useState<number>(0);
  const [trackPrice, setTrackPrice] = useState<number>(0);

  const thicknessOptions: Record<number, number> = {
    0.8: 9,
    1.0: 11,
    1.2: 13,
    1.5: 16,
  };

  let validArea = width > 0 && height > 0;


  const calculatedValues = useMemo(() => {
    let curtainWidth = calcType === "1" ? width + 0.16 : width - 0.11;
    let curtainHeight = calcType === "1" ? height + 0.6 : height + 0.2;
    let curtainArea = parseFloat((curtainWidth * curtainHeight).toFixed(2));
    let curtainWeight = parseFloat((curtainArea * thicknessOptions[thickness]).toFixed(2));
    let motorType: string;
    let motorPrice: number;


    if (curtainWeight < 250) {
      motorType = "600型号";
      motorPrice = 380;
    } else if (curtainWeight < 380) {
      motorType = "小800";
      motorPrice = 480;
    } else if (curtainWeight < 450) {
      motorType = "大800";
      motorPrice = 650;
    } else if (curtainWeight < 550) {
      motorType = "一吨";
      motorPrice = 750;
    } else {
      motorType = "超规格，需特殊处理";
      motorPrice = 0;
    }

    let shaftCost = curtainWidth * shaftPrice;
    let trackWidth = calcType === "1" ? width + 0.05 : width - 0.35;
    let trackCost = trackWidth * trackPrice * 2;
    let totalCost = parseFloat((curtainArea * curtainPrice + shaftCost + trackCost + motorPrice).toFixed(2));

    return { curtainWidth, curtainHeight, curtainArea, curtainWeight, motorType, totalCost };
  }, [calcType, width, height, thickness, curtainPrice, shaftPrice, trackPrice]);

  return (
    <Card className="p-6 max-w-md mx-auto mt-10 shadow-lg">
      <CardContent className="gap-y-2 flex flex-col">
        <h2 className="text-xl font-bold mb-4">卷闸门报价计算器</h2>
        <div className="flex items-center gap-2">
          <Label>尺寸</Label>
          <Select value={calcType} onValueChange={setCalcType}>
            <SelectTrigger>{calcType === "1" ? "按洞口尺寸" : "按总尺寸"}</SelectTrigger>
            <SelectContent>
              <SelectItem value="1">按洞口尺寸</SelectItem>
              <SelectItem value="2">按总尺寸</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label>宽度 (m)</Label>
          <Input type="number" onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}/>
        </div>
        <div className="flex items-center gap-2">
          <Label>高度 (m)</Label>
          <Input type="number" onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}/>
        </div>
        <div className="flex items-center gap-2">
          <Label>帘片厚度</Label>
          <Select value={thickness.toString()} onValueChange={(value) => setThickness(parseFloat(value))}>
            <SelectTrigger>{thickness}mm</SelectTrigger>
            <SelectContent>
              <SelectItem value="0.8">0.8mm</SelectItem>
              <SelectItem value="1.0">1.0mm</SelectItem>
              <SelectItem value="1.2">1.2mm</SelectItem>
              <SelectItem value="1.5">1.5mm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label>帘片尺寸</Label>
          <span>
            {
              validArea ? `${calculatedValues.curtainWidth.toFixed(2)} x ${calculatedValues.curtainHeight.toFixed(2)} m` : ''
            }
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Label>帘片面积</Label>
          <span>
            {
              validArea ? `${calculatedValues.curtainArea} ㎡` : ''
            }
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Label>帘片重量</Label>
          <span>
            {
              validArea ? `${calculatedValues.curtainWeight} kg` : ''
            }
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Label>电机型号</Label>
          <span>
            {
              validArea ? `${calculatedValues.motorType} kg` : ''
            }
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Label>帘片单价 (元/㎡)</Label>
          <Input type="number" onChange={(e) => setCurtainPrice(parseFloat(e.target.value) || 0)}/>
        </div>
        <div className="flex items-center gap-2">
          <Label>传动轴单价 (元/m)</Label>
          <Input type="number" onChange={(e) => setShaftPrice(parseFloat(e.target.value) || 0)}/>
        </div>
        <div className="flex items-center gap-2">
          <Label>滑道单价 (元/m)</Label>
          <Input type="number" onChange={(e) => setTrackPrice(parseFloat(e.target.value) || 0)}/>
        </div>
        <h3 className="text-lg font-bold mt-4">总价格:
          {
            validArea ? `${calculatedValues.totalCost} 元` : ''
          }
        </h3>
      </CardContent>
    </Card>
  );
}
