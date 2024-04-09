import {
  Search,
  MoreHorizontal,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IconButton } from "./icon-button";
import { Table, TableRow, TableHeader, TableCell } from "./table";
import { ChangeEvent, useEffect, useState } from "react";

dayjs.extend(relativeTime);

interface Attendee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  checkedInAt: string | null;
}

export function AttendeeList() {
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has("page"))
      return Number(url.searchParams.get("page"));

    return 1;
  });

  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has("search"))
      return url.searchParams.get("search") ?? "";

    return "";
  });

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const totalPages = Math.ceil(totalAttendees / 10);

  useEffect(() => {
    // Static EventID created on BackEnd
    // ../events/{eventID}/attendees
    const url = new URL(
      "http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees"
    );

    url.searchParams.set("pageIndex", String(page - 1));
    if (search.length > 0) url.searchParams.set("query", search);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setAttendees(data.attendees);
        setTotalAttendees(data.total);
      });
  }, [page, search]);

  const setCurrentSearch = (search: string) => {
    const url = new URL(window.location.toString());

    url.searchParams.set("search", String(search));

    window.history.pushState({}, "", url);
    setSearch(search);
  };

  const setCurrentPage = (page: number) => {
    const url = new URL(window.location.toString());

    url.searchParams.set("page", String(page));

    window.history.pushState({}, "", url);
    setPage(page);
  };

  const handleOnChangeInputSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleOnClickGoToFirstPage = () => {
    setCurrentPage(1);
  };

  const handleOnClickGoToPreviousPage = () => {
    if (page !== 1) setCurrentPage(page - 1);
  };

  const handleOnClickGoToNextPage = () => {
    if (page !== totalPages) setCurrentPage(page + 1);
  };

  const handleOnClickGoToLastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participants</h1>
        <div className="w-72 px-3 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3">
          <Search className="size-4 text-emerald-200" />
          <input
            onChange={handleOnChangeInputSearch}
            value={search}
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
            placeholder="Search participants..."
          />
        </div>
      </div>

      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 48 }}>
              <input
                type="checkbox"
                className="size-4 bg-black/20 rounded border border-white/10"
              />
            </TableHeader>
            <TableHeader>Code</TableHeader>
            <TableHeader>Participant</TableHeader>
            <TableHeader>Register Date</TableHeader>
            <TableHeader>Check-In Date</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            return (
              <TableRow key={attendee.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="size-4 bg-black/20 rounded border border-white/10"
                  />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {attendee.name}
                    </span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                <TableCell>
                  {attendee.checkedInAt === null ? (
                    <span className="text-zinc-400">Without check-in</span>
                  ) : (
                    dayjs().to(attendee.checkedInAt)
                  )}
                </TableCell>
                <TableCell>
                  <IconButton transparent>
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Showing {attendees.length} of {totalAttendees} items
            </TableCell>

            <TableCell className="text-right" colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>
                  Page {page} of {totalPages}
                </span>

                <div className="flex gap-1.5">
                  <IconButton
                    disabled={page === 1}
                    onClick={handleOnClickGoToFirstPage}
                  >
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton
                    disabled={page === 1}
                    onClick={handleOnClickGoToPreviousPage}
                  >
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton
                    disabled={page === totalPages}
                    onClick={handleOnClickGoToNextPage}
                  >
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton
                    disabled={page === totalPages}
                    onClick={handleOnClickGoToLastPage}
                  >
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
