// TokenSelector.tsx

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

interface Token {
  label: string;
  name: string;
  icon: string;
  address: string;
  abr: string;
}

interface TokenSelectorProps {
  selected: Token;
  onSelect: (item: Token) => void;
  items: Token[];
}

export function TokenSelector({
  selected,
  onSelect,
  items,
}: TokenSelectorProps) {
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
              'justify-between border h-12 bg-transparent transition-transform transform hover:scale-105',
              open && 'scale-105 bg-muted/70 text-accent-foreground'
            )}
          >
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={selected.icon} />
                <AvatarFallback>{selected.abr}</AvatarFallback>
              </Avatar>
              <span className="text-base font-bold">{selected.label}</span>
            </div>
            <ChevronsUpDown
              className={cn(
                'ml-1 h-4 w-4 shrink-0 opacity-50 transition-opacity',
                open && 'opacity-100'
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0 bg-popover text-popover-foreground border border-border">
          <Command>
            <CommandInput placeholder="Search token..." />
            <CommandList>
              <CommandEmpty>No token found.</CommandEmpty>
              <CommandGroup>
                {items.map((tokenItem) => (
                  <CommandItem
                    key={tokenItem.label}
                    value={tokenItem.label}
                    onSelect={() => {
                      onSelect(tokenItem);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selected.label === tokenItem.label
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={tokenItem.icon} />
                        <AvatarFallback>{tokenItem.abr}</AvatarFallback>
                      </Avatar>
                      <span className="text-base text-foreground">
                        {tokenItem.label}
                      </span>
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
