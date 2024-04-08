import { Header, AttendeeList } from "./components";

export function App() {
  return (
    <div className="max-w-[1216px] mx-auto py-5 px-8 flex flex-col gap-5">
      <Header />
      <AttendeeList />
    </div>
  );
}
