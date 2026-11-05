import { Column } from '@tanstack/react-table';

// Extend the ColumnMeta interface to include our custom filterType
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    filterType?: 'text' | 'select' | 'range';
  }
}
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Filter, X } from 'lucide-react';

export interface TableFiltersProps<TData> {
  columns: Column<TData, unknown>[];
  className?: string;
}

export function TableFilters<TData>({
  columns,
  className = '',
}: TableFiltersProps<TData>) {
  const filterableColumns = columns.filter(column => column.getCanFilter());

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {filterableColumns.map(column => {
        const filterValue = column.getFilterValue();
        const filterType = column.columnDef.meta?.filterType || 'text';

        return (
          <div key={column.id} className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={filterValue ? 'default' : 'outline'}
                  size="sm"
                  className="h-8"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {String(column.id)}
                  {filterValue != null && (
                    <Badge variant="secondary" className="ml-2 h-4 px-1">
                      {Array.isArray(filterValue) ? filterValue.length : 1}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px] z-50">
                <div className="p-2">
                  {filterType === 'text' && (
                    <Input
                      placeholder={`Filter ${column.id}...`}
                      value={(filterValue as string) ?? ''}
                      onChange={e => column.setFilterValue(e.target.value)}
                      className="h-8"
                    />
                  )}

                  {filterType === 'select' && (
                    <div className="space-y-1">
                      {Array.from(column.getFacetedUniqueValues().keys()).map(
                        value => (
                          <DropdownMenuCheckboxItem
                            key={String(value)}
                            checked={(filterValue as string[])?.includes(
                              String(value)
                            )}
                            onCheckedChange={checked => {
                              const currentFilter =
                                (filterValue as string[]) || [];
                              if (checked) {
                                column.setFilterValue([
                                  ...currentFilter,
                                  String(value),
                                ]);
                              } else {
                                column.setFilterValue(
                                  currentFilter.filter(v => v !== String(value))
                                );
                              }
                            }}
                          >
                            {String(value)} (
                            {column.getFacetedUniqueValues().get(value)})
                          </DropdownMenuCheckboxItem>
                        )
                      )}
                    </div>
                  )}

                  {filterType === 'range' && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Min"
                        value={(filterValue as [string, string])?.[0] ?? ''}
                        onChange={e => {
                          const currentFilter = (filterValue as [
                            string,
                            string,
                          ]) || ['', ''];
                          column.setFilterValue([
                            e.target.value,
                            currentFilter[1],
                          ]);
                        }}
                        className="h-8"
                      />
                      <Input
                        placeholder="Max"
                        value={(filterValue as [string, string])?.[1] ?? ''}
                        onChange={e => {
                          const currentFilter = (filterValue as [
                            string,
                            string,
                          ]) || ['', ''];
                          column.setFilterValue([
                            currentFilter[0],
                            e.target.value,
                          ]);
                        }}
                        className="h-8"
                      />
                    </div>
                  )}
                </div>

                {filterValue != null && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => column.setFilterValue(undefined)}
                        className="w-full justify-start"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear filter
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );
}

export default TableFilters;
