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
import { attendees } from "../data/attendees";
import { useState } from "react";

dayjs.extend(relativeTime);

export function AttendeeList() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(attendees.length / 10);

  const handleOnClickGoToFirstPage = () => {
    setPage(1);
  };

  const handleOnClickGoToPreviousPage = () => {
    if (page !== 1) setPage(page - 1);
  };

  const handleOnClickGoToNextPage = () => {
    if (page !== totalPages) setPage(page + 1);
  };

  const handleOnClickGoToLastPage = () => {
    setPage(totalPages);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participants</h1>
        <div className="w-72 px-3 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3">
          <Search className="size-4 text-emerald-200" />
          <input
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm"
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
          {attendees.slice((page - 1) * 10, page * 10).map((attendee) => {
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
                <TableCell>{dayjs().to(attendee.checkedInAt)}</TableCell>
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
            <TableCell colSpan={3}>Showing 10 of {attendees.length}</TableCell>

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
