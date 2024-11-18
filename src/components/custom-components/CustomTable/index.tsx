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
    <Table className="h-full w-full overflow-y-scroll">
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow style={{ borderBottomWidth: 0 }}>
          {columns.map((column, index) => (
            <TableHead
              key={index}
              // style={{ width: column?.width && column.width }}
            >
              <div className="rounded-md bg-slate-300 text-black py-1 px-5 text-center whitespace-nowrap">
                {column.label}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="h-full overflow-y-scroll">
        {data.map((item, rowIndex) => (
          <TableRow key={rowIndex} className="border-b-0 cursor-pointer">
            {columns.map((column, colIndex) =>
              column?.key ? (
                <TableCell key={colIndex}>{item[column.key]}</TableCell>
              ) : (
                <TableCell key={colIndex}>{column?.render(item)}</TableCell>
              )
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomTable;
