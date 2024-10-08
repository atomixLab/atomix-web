// ChainSelector.tsx

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Chain {
  value: string;
  label: string;
  icon: string;
  abr: string;
  tokens: Token[];
}

interface Token {
  label: string;
  name: string;
  icon: string;
  address: string;
  abr: string;
}

interface ChainSelectorProps {
  selected: Chain;
  onSelect: (item: Chain) => void;
  items: Chain[];
}

export function ChainSelector({
  selected,
  onSelect,
  items,
}: ChainSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="group">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'justify-between border h-10 bg-transparent transition-transform transform hover:scale-105',
              open && 'scale-105 bg-accent text-accent-foreground'
            )}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={selected.icon} />
                <AvatarFallback>{selected.abr}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{selected.label}</span>
            </div>
            <ChevronsUpDown
              className={cn(
                'ml-2 h-4 w-4 shrink-0 opacity-50 transition-opacity',
                open && 'opacity-100'
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0 bg-popover text-popover-foreground border border-border">
          <Command>
            <CommandInput placeholder="Search chain..." />
            <CommandList>
              <CommandEmpty>No chain found.</CommandEmpty>
              <CommandGroup>
                {items.map((chainItem) => (
                  <CommandItem
                    key={chainItem.value}
                    value={chainItem.label}
                    onSelect={() => {
                      onSelect(chainItem);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selected.value === chainItem.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={chainItem.icon} />
                        <AvatarFallback>{chainItem.abr}</AvatarFallback>
                      </Avatar>
                      {chainItem.label}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
}
