import { Timeline } from "./components/timeline";
const { Holder, OutsideDraggable } = Timeline;
import "./global.scss";

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
    },
    {
      id: `${i} 3`,
      startDate: "23.09.2024",
      dueDate: "24.09.2024",
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

      <Timeline
        header={{
          extra: () => "sdfsfsdf",
        }}
        size={JSON.parse(localStorage.getItem("size") || "{}")}
        onResize={({ size }) => {
          localStorage.setItem("size", JSON.stringify(size));
        }}
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
                  >
                    <div>sdfsfsd</div>
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
