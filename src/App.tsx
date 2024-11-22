import dayjs from "dayjs";
import { Timeline } from "./components/timeline";
const { Holder, OutsideDraggable } = Timeline;
import "./global.scss";
import { DropDown } from "./components/dropdown";

const dataDefault = Array.from({ length: 10 }).map((_, i) => ({
  name: `MRX ${i}`,
  id: `${i}`,
  childern: [
    {
      id: `${i} 1`,
      startDate: "23.09.2024",
      dueDate: "23.09.2024",
    },
    {
      id: `${i} 2`,
      startDate: "23.09.2024",
      dueDate: "23.09.2024",
      blockings: i === 2 ? ["0 4"] : [],
      waitings: i === 2 ? ["0 4"] : [],
    },
    {
      id: `${i} 3`,
      startDate: "23.09.2024",
      dueDate: "24.09.2024",
      waitings: i === 2 ? ["0 4"] : [],
    },
    {
      id: `${i} 4`,
      startDate: "24.09.2024",
      dueDate: "25.09.2024",
      blockings: i === 0 ? ["2 2", "2 3"] : [],
      waitings: i === 0 ? ["2 2"] : [],
    },
  ],
}));

const App = () => {
  return (
    <>
      {/* <br />
      <br />
      <br />
      <div
        style={{
          display: "flex",
          marginLeft: 100,
          width: "100%",
          height: "100%",
        }}
      >
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
          unde quaerat alias voluptatem aliquid! Nam culpa eaque doloremque
          expedita vel voluptate magni. Perspiciatis alias corrupti
          exercitationem numquam in porro? Dolor.
        </div>
        <div> */}
      {/* <br />
      <br />
      <br />
      <br />
      <br />
      <br /> */}
      {/* <div style={{ display: "flex" }}> */}
      {/* <div>
        <OutsideDraggable
          onDragEnd={(range) => {
            console.log(range);
          }}
        >
          <div>sdfsdfsd</div>
        </OutsideDraggable>
      </div> */}
      {/* sdfsdfds */}
      <Timeline
        header={{
          extra: () => "sdfsfsdf",
        }}
        size={JSON.parse(localStorage.getItem("size") || "{}")}
        onResize={({ size }) => {
          localStorage.setItem("size", JSON.stringify(size));
        }}
        startDate={dayjs("2024-09-18")}
        dependencies
      >
        <>
          {dataDefault?.map((item) => (
            <Holder
              id={item?.id}
              key={item?.id}
              content={<div style={{ minHeight: 50 }}>{item?.name}</div>}
            >
              <>
                {item?.childern?.map((holder) => (
                  <Holder.Range
                    {...holder}
                    key={holder?.id}
                    holder={{ id: holder?.id }}
                    blocking={{
                      ids: holder?.blockings,
                      line: { visible: false },
                      // render: ({ elm }) => elm,
                    }}
                    waiting={{
                      ids: holder?.waitings,
                      // render: ({ elm }) => elm,
                    }}
                    onDependenceEnd={(value) => {
                      console.log(value);
                    }}
                  >
                    <div>{holder?.id}</div>
                  </Holder.Range>
                ))}
              </>
            </Holder>
          ))}
        </>
      </Timeline>
      {/* </div> */}
      {/* </div>
      </div> */}
      {/* <Timeline /> */}
      {/* <Timeline /> */}
    </>
  );
};

export default App;
