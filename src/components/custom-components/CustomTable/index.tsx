import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  data: any[];
  columns: any[];
  caption?: string;
}

const CustomTable = ({ data, columns, caption }: Props) => {
  return (
    <div className="h-full flex flex-col">
      <div className="overflow-auto relative h-full w-full">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow style={{ borderBottomWidth: 0 }}>
              {columns.map((column, index) => (
                <TableHead key={index} className="p-2">
                  <div className="rounded-md bg-slate-300 text-black py-1 px-5 text-center whitespace-nowrap">
                    {column.label}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {data.map((item, rowIndex) => (
              <TableRow key={rowIndex} className="border-b-0 cursor-pointer">
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className="p-2 text-center"
                    style={{ width: `${100 / columns.length}%` }}
                  >
                    {column?.key ? item[column.key] : column?.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomTable;
