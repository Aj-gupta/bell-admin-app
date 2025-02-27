import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface ColumnProps {
  label: string;
  key?: string;
  render?: (item: any) => React.ReactNode;
  sticky?: boolean;
}

interface Props {
  data: any[];
  columns: ColumnProps[];
  caption?: string;
  isDetails?: boolean;
  DetailComponent?: React.ComponentType<{ item: any }>;
}

const CustomTable = ({
  data,
  columns,
  caption,
  isDetails = false,
  DetailComponent,
}: Props) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (index: number) => {
    if (!isDetails) return;
    setExpandedRow(expandedRow === index ? null : index);
  };

  const renderDefaultDetailRow = (item: any) => {
    return (
      <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50">
        {Object.entries(item).map(([key, value]: [string, any]) => {
          if (
            value === null ||
            value === undefined ||
            typeof value === "object"
          )
            return null;

          return (
            <div key={key} className="space-y-1">
              <p className="text-sm font-medium capitalize">
                {key.replace(/_/g, " ")}
              </p>
              <p className="text-sm">{String(value)}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-auto relative h-full w-full">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow style={{ borderBottomWidth: 0 }}>
              {isDetails && (
                <TableHead className="p-2 w-10">
                  <div className="rounded-md bg-slate-300 text-black py-1 px-2 text-center"></div>
                </TableHead>
              )}
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={`p-2 ${
                    column.sticky
                      ? "sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]"
                      : ""
                  }`}
                >
                  <div className="rounded-md bg-slate-300 text-black py-1 px-5 text-center whitespace-nowrap">
                    {column.label}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {data.map((item, rowIndex) => (
              <>
                <TableRow
                  key={`row-${rowIndex}`}
                  className={`border-b-0 ${
                    isDetails ? "cursor-pointer hover:bg-slate-100" : ""
                  }`}
                  onClick={() => toggleRow(rowIndex)}
                >
                  {isDetails && (
                    <TableCell className="p-2 w-10 text-center">
                      {expandedRow === rowIndex ? "▼" : "▶"}
                    </TableCell>
                  )}
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={`p-2 text-center ${
                        column.sticky
                          ? "sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]"
                          : ""
                      }`}
                      style={{ width: `${100 / columns.length}%` }}
                    >
                      {column?.key ? item[column.key] : column?.render?.(item)}
                    </TableCell>
                  ))}
                </TableRow>
                {isDetails && expandedRow === rowIndex && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (isDetails ? 1 : 0)}
                      className="p-0"
                    >
                      {DetailComponent ? (
                        <DetailComponent item={item} />
                      ) : (
                        renderDefaultDetailRow(item)
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomTable;
