import { useState } from 'react';
import { DotFilledIcon } from '@radix-ui/react-icons';
import { DropdownMenu as DropdownMenuOriginal } from 'radix-ui';
import CheckIcon from '../../../components/svgs/CheckIcon';
import RightArrow from '../../../components/svgs/RightArrow';
import styles from './DropdownMenuContent.module.css';

const {
  Portal,
  Item,
  Sub,
  SubTrigger,
  SubContent,
  Separator,
  ItemIndicator,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Label,
} = DropdownMenuOriginal;

export default function DropdownMenuContent() {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState('pedro');

  return (
    <>
      <Item className={styles.dropdownMenuItem}>
        New Tab <div className={styles.rightSlot}>⌘+T</div>
      </Item>

      <Item className={styles.dropdownMenuItem}>
        New Window <div className={styles.rightSlot}>⌘+N</div>
      </Item>

      <Item className={styles.dropdownMenuItem} disabled>
        New Private Window <div className={styles.rightSlot}>⇧+⌘+N</div>
      </Item>

      <Sub>
        <SubTrigger className={styles.dropdownMenuSubTrigger}>
          More Tools
          <div className={styles.rightSlot}>
            <RightArrow className='size-3' />
          </div>
        </SubTrigger>

        <Portal>
          <SubContent className={styles.dropdownMenuSubContent} sideOffset={2} alignOffset={-5}>
            <Item className={styles.dropdownMenuItem}>
              Save Page As… <div className='RightSlot'>⌘+S</div>
            </Item>

            <Item className={styles.dropdownMenuItem}>Create Shortcut…</Item>

            <Item className={styles.dropdownMenuItem}>Name Window…</Item>

            <Separator className={styles.dropdownMenuSeparator} />

            <Item className={styles.dropdownMenuItem}>Developer Tools</Item>
          </SubContent>
        </Portal>
      </Sub>

      <Separator className={styles.dropdownMenuSeparator} />

      <CheckboxItem
        checked={bookmarksChecked}
        onCheckedChange={setBookmarksChecked}
        className={styles.dropdownMenuCheckboxItem}
      >
        <ItemIndicator className={styles.dropdownMenuItemIndicator}>
          <CheckIcon className='size-4' />
        </ItemIndicator>
        Show Bookmarks <div className={styles.rightSlot}>⌘+B</div>
      </CheckboxItem>

      <CheckboxItem checked={urlsChecked} onCheckedChange={setUrlsChecked} className={styles.dropdownMenuCheckboxItem}>
        <ItemIndicator className={styles.dropdownMenuItemIndicator}>
          <CheckIcon className='size-4' />
        </ItemIndicator>
        Show Full URLs
      </CheckboxItem>

      <Separator className={styles.dropdownMenuSeparator} />

      <Label className={styles.dropdownMenuLabel}>People</Label>

      <RadioGroup value={person} onValueChange={setPerson}>
        <RadioItem className={styles.dropdownMenuRadioItem} value='pedro'>
          <ItemIndicator className={styles.dropdownMenuItemIndicator}>
            <DotFilledIcon />
          </ItemIndicator>
          Pedro Duarte
        </RadioItem>

        <RadioItem className={styles.dropdownMenuRadioItem} value='colm'>
          <ItemIndicator className={styles.dropdownMenuItemIndicator}>
            <DotFilledIcon />
          </ItemIndicator>
          Colm Tuite
        </RadioItem>
      </RadioGroup>
    </>
  );
}
