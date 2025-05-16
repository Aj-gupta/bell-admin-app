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
import { Input } from "@/components/ui/input";
import {
  MixerHorizontalIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface ColumnProps {
  label: string;
  key?: string;
  render?: (item: any) => React.ReactNode;
  sticky?: boolean;
  valueGetter?: (item: any) => string | number | null | undefined;
  filter?: boolean;
}

interface Props {
  data: any[];
  columns: ColumnProps[];
  caption?: string;
  isDetails?: boolean;
  DetailComponent?: React.ComponentType<{ item: any }>;
  disableSearch?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: any[]) => void;
}

const CustomTable = ({
  data,
  columns,
  caption,
  isDetails = false,
  DetailComponent,
  disableSearch = false,
  selectable = false,
  onSelectionChange,
}: Props) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {}
  );
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    if (!isDetails) return;
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleColumnFilterChange = (columnKey: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIndices = filteredData.map((_, index) => index);
      setSelectedRows(new Set(allIndices));
      onSelectionChange?.(filteredData);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(index);
    } else {
      newSelectedRows.delete(index);
    }
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(filteredData.filter((_, i) => newSelectedRows.has(i)));
  };

  const filteredData = data.filter((item) => {
    // Apply global search
    if (searchTerm) {
      const matchesSearch = columns.some((column) => {
        let value;
        if (column.valueGetter) {
          value = column.valueGetter(item);
        } else if (column.key) {
          value = item[column.key];
        }

        if (value === null || value === undefined) return false;

        const searchValue = String(value).toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();
        return searchValue.includes(searchTermLower);
      });
      if (!matchesSearch) return false;
    }

    // Apply column filters
    return Object.entries(columnFilters).every(([columnLabel, filterValue]) => {
      if (!filterValue) return true;

      const column = columns.find((col) => col.label === columnLabel);
      if (!column) return true;

      let value;
      if (column.valueGetter) {
        value = column.valueGetter(item);
      } else if (column.key) {
        value = item[column.key];
      }

      if (value === null || value === undefined) return false;

      const searchValue = String(value).toLowerCase();
      const filterValueLower = filterValue.toLowerCase();
      return searchValue.includes(filterValueLower);
    });
  });

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
      {!disableSearch ? (
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      ) : (
        ""
      )}
      <div className="overflow-auto relative h-full w-full">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow style={{ borderBottomWidth: 0 }}>
              {selectable && (
                <TableHead className="p-2 w-10">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={
                        selectedRows.size === filteredData.length &&
                        filteredData.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
                </TableHead>
              )}
              {isDetails && (
                <TableHead className="p-2 w-10">
                  {/* <div className="rounded-md bg-slate-300 text-black py-1 px-2 text-center"></div> */}
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
                    <div className="flex items-center justify-center gap-2">
                      {column.label}
                      {column.filter && (column.key || column.valueGetter) && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="p-1 hover:bg-slate-400 rounded">
                              <MixerHorizontalIcon className="h-4 w-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48">
                            <Input
                              type="text"
                              placeholder={`Filter ${column.label}`}
                              value={columnFilters[column.label] || ""}
                              onChange={(e) =>
                                handleColumnFilterChange(
                                  column.label,
                                  e.target.value
                                )
                              }
                              className="w-full"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {filteredData.map((item, rowIndex) => (
              <>
                <TableRow
                  key={`row-${rowIndex}`}
                  className={`border-b-0 ${
                    isDetails ? "cursor-pointer hover:bg-slate-100" : ""
                  }`}
                  onClick={() => toggleRow(rowIndex)}
                >
                  {selectable && (
                    <TableCell className="p-2 w-10">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={selectedRows.has(rowIndex)}
                          onCheckedChange={(checked) =>
                            handleSelectRow(rowIndex, checked as boolean)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </TableCell>
                  )}
                  {isDetails && (
                    <TableCell className="p-2 w-10 text-center">
                      {expandedRow === rowIndex ? (
                        <ChevronDownIcon className="mx-auto h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="mx-auto h-4 w-4" />
                      )}
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
