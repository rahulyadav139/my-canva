'use client';

import { Stage, Layer, Rect, Transformer } from 'react-konva';
import { useRef, useEffect } from 'react';

export const StageComponent = () => {
  const rectRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    trRef.current?.nodes([rectRef.current as any]);
  }, []);
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Rect
          x={50}
          y={50}
          width={100}
          height={100}
          fill="yellow"
          stroke="black"
          draggable
          ref={rectRef}
        />
        {/* <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width > 200) {
              return oldBox;
            }
            return newBox;
          }}
        /> */}
      </Layer>
    </Stage>
  );
};
