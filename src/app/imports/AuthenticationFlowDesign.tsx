import svgPaths from "./svg-fs0mrl9mh4";
import clsx from "clsx";
type Button23Props = {
  additionalClassNames?: string;
};

function Button23({ children, additionalClassNames = "" }: React.PropsWithChildren<Button23Props>) {
  return (
    <div className={clsx("h-[29.6px] relative rounded-[10px] shrink-0", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type Container22Props = {
  additionalClassNames?: string;
};

function Container22({ children, additionalClassNames = "" }: React.PropsWithChildren<Container22Props>) {
  return (
    <div className={clsx("relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">{children}</div>
    </div>
  );
}
type DateFilter2Props = {
  additionalClassNames?: string;
};

function DateFilter2({ children, additionalClassNames = "" }: React.PropsWithChildren<DateFilter2Props>) {
  return (
    <div className={clsx("bg-white h-[37.6px] relative rounded-[10px] shrink-0", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[16.8px] py-[0.8px] relative size-full">{children}</div>
    </div>
  );
}

function Wrapper4({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}
type Wrapper3Props = {
  additionalClassNames?: string;
};

function Wrapper3({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper3Props>) {
  return (
    <div className={additionalClassNames}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">{children}</div>
    </div>
  );
}
type Wrapper2Props = {
  additionalClassNames?: string;
};

function Wrapper2({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper2Props>) {
  return <Wrapper3 additionalClassNames={clsx("relative shrink-0", additionalClassNames)}>{children}</Wrapper3>;
}

function Icon9({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div className={clsx("absolute left-0 size-[12px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}
type TextText3Props = {
  text: string;
  additionalClassNames?: string;
};

function TextText3({ text, additionalClassNames = "" }: TextText3Props) {
  return (
    <Wrapper3 additionalClassNames={clsx("h-[22.5px] relative shrink-0", additionalClassNames)}>
      <p className="font-['Poppins:Regular',sans-serif] leading-[22.5px] not-italic relative shrink-0 text-[#364153] text-[15px] text-center text-nowrap">{text}</p>
    </Wrapper3>
  );
}
type ParagraphTextProps = {
  text: string;
};

function ParagraphText({ text }: ParagraphTextProps) {
  return (
    <div className="h-[15.988px] relative shrink-0 w-full">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] text-nowrap top-[0.2px]">{text}</p>
    </div>
  );
}
type OptionText7Props = {
  text: string;
};

function OptionText7({ text }: OptionText7Props) {
  return (
    <div className="h-0 relative shrink-0 w-full">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[normal] left-0 text-[#0a0a0a] text-[14px] top-0 w-0">{text}</p>
    </div>
  );
}
type TableCellText2Props = {
  text: string;
  additionalClassNames?: string;
};

function TableCellText2({ text, additionalClassNames = "" }: TableCellText2Props) {
  return (
    <div className={clsx("absolute left-[602.67px] top-0 w-[236.338px]", additionalClassNames)}>
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[20px] left-[24px] text-[#364153] text-[14px] text-nowrap top-[34.39px]">{text}</p>
    </div>
  );
}
type ContainerText5Props = {
  text: string;
};

function ContainerText5({ text }: ContainerText5Props) {
  return (
    <div className="absolute h-[40px] left-[24px] top-[16.4px] w-[73.75px]">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#101828] text-[14px] top-0 w-[38px]">{text}</p>
    </div>
  );
}
type OptionText6Props = {
  text: string;
};

function OptionText6({ text }: OptionText6Props) {
  return (
    <div className="absolute left-[-1151.01px] size-0 top-[-740.73px]">
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[normal] left-0 text-[#ca3500] text-[14px] top-0 w-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type OptionText5Props = {
  text: string;
};

function OptionText5({ text }: OptionText5Props) {
  return (
    <div className="absolute left-[-1151.01px] size-0 top-[-663.94px]">
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[normal] left-0 text-[#c10007] text-[14px] top-0 w-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type OptionText4Props = {
  text: string;
};

function OptionText4({ text }: OptionText4Props) {
  return (
    <div className="absolute left-[-1151.01px] size-0 top-[-587.15px]">
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[normal] left-0 text-[#364153] text-[14px] top-0 w-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type OptionText3Props = {
  text: string;
  additionalClassNames?: string;
};

function OptionText3({ text, additionalClassNames = "" }: OptionText3Props) {
  return (
    <div className={clsx("absolute left-[-1151.01px] size-0", additionalClassNames)}>
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[normal] left-0 text-[#8200db] text-[14px] top-0 w-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type ContainerText4Props = {
  text: string;
  additionalClassNames?: string;
};

function ContainerText4({ text, additionalClassNames = "" }: ContainerText4Props) {
  return (
    <div className={clsx("absolute left-[24px] top-[36.4px] w-[123.675px]", additionalClassNames)}>
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-0.8px] w-[82px]">{text}</p>
    </div>
  );
}
type OptionText2Props = {
  text: string;
};

function OptionText2({ text }: OptionText2Props) {
  return (
    <div className="absolute left-[-1151.01px] size-0 top-[-433.58px]">
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[normal] left-0 text-[#a65f00] text-[14px] top-0 w-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type TableCellText1Props = {
  text: string;
};

function TableCellText1({ text }: TableCellText1Props) {
  return (
    <div className="absolute h-[68.8px] left-[602.67px] top-0 w-[236.338px]">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[20px] left-[24px] text-[#364153] text-[14px] text-nowrap top-[24.4px]">{text}</p>
    </div>
  );
}
type OptionText1Props = {
  text: string;
  additionalClassNames?: string;
};

function OptionText1({ text, additionalClassNames = "" }: OptionText1Props) {
  return (
    <div className={clsx("absolute left-[-1151.01px] size-0", additionalClassNames)}>
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[normal] left-0 text-[#008236] text-[14px] top-0 w-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type Text8Props = {
  text: string;
  additionalClassNames?: string;
};

function Text8({ text, additionalClassNames = "" }: Text8Props) {
  return (
    <div className={clsx("bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full", additionalClassNames)}>
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">{text}</p>
    </div>
  );
}
type TextText2Props = {
  text: string;
};

function TextText2({ text }: TextText2Props) {
  return (
    <div className="h-[20px] relative shrink-0 w-[84.15px]">
      <Text8 text={text} />
    </div>
  );
}

function Icon3() {
  return (
    <Wrapper>
      <path d={svgPaths.p26b72c80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
      <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
    </Wrapper>
  );
}
type OptionTextProps = {
  text: string;
  additionalClassNames?: string;
};

function OptionText({ text, additionalClassNames = "" }: OptionTextProps) {
  return (
    <div className={clsx("absolute left-[-1151.01px] size-0", additionalClassNames)}>
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[normal] left-0 text-[#1447e6] text-[14px] top-0 w-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}
type TableCellTextProps = {
  text: string;
};

function TableCellText({ text }: TableCellTextProps) {
  return (
    <div className="absolute h-[84.775px] left-[602.67px] top-0 w-[236.338px]">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[20px] left-[24px] text-[#364153] text-[14px] text-nowrap top-[32.39px]">{text}</p>
    </div>
  );
}
type ContainerText3Props = {
  text: string;
  additionalClassNames?: string;
};

function ContainerText3({ text, additionalClassNames = "" }: ContainerText3Props) {
  return (
    <div className={clsx("absolute content-stretch flex h-[20px] items-start left-[24px] w-[123.675px]", additionalClassNames)}>
      <p className="basis-0 font-['Manrope:Medium',sans-serif] font-medium grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#101828] text-[14px]">{text}</p>
    </div>
  );
}
type ContainerText2Props = {
  text: string;
  additionalClassNames?: string;
};

function ContainerText2({ text, additionalClassNames = "" }: ContainerText2Props) {
  return (
    <div className={clsx("absolute content-stretch flex h-[20px] items-start left-[24px]", additionalClassNames)}>
      <p className="basis-0 font-['Manrope:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#101828] text-[14px]">{text}</p>
    </div>
  );
}
type ContainerText1Props = {
  text: string;
  additionalClassNames?: string;
};

function ContainerText1({ text, additionalClassNames = "" }: ContainerText1Props) {
  return (
    <div className={clsx("absolute h-[15.988px] left-[24px]", additionalClassNames)}>
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] text-nowrap top-[-0.8px]">{text}</p>
    </div>
  );
}
type ContainerTextProps = {
  text: string;
  additionalClassNames?: string;
};

function ContainerText({ text, additionalClassNames = "" }: ContainerTextProps) {
  return (
    <div className={clsx("absolute content-stretch flex h-[20px] items-start left-[24px] w-[73.75px]", additionalClassNames)}>
      <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#101828] text-[14px] text-nowrap">{text}</p>
    </div>
  );
}
type HeaderCellTextProps = {
  text: string;
  additionalClassNames?: string;
};

function HeaderCellText({ text, additionalClassNames = "" }: HeaderCellTextProps) {
  return (
    <div className={clsx("absolute h-[64.4px] top-0", additionalClassNames)}>
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[20px] left-[24px] not-italic text-[#364153] text-[14px] text-nowrap top-[22px]">{text}</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[12px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <Icon2 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <Wrapper1 additionalClassNames="top-[8px]">
      <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
    </Wrapper1>
  );
}

function Icon1() {
  return (
    <Wrapper1 additionalClassNames="top-0">
      <path d="M9 7.5L6 4.5L3 7.5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
    </Wrapper1>
  );
}
type TextText1Props = {
  text: string;
  additionalClassNames?: string;
};

function TextText1({ text, additionalClassNames = "" }: TextText1Props) {
  return (
    <Wrapper3 additionalClassNames={clsx("h-[20px] relative shrink-0", additionalClassNames)}>
      <p className="font-['Poppins:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#364153] text-[14px] text-center text-nowrap">{text}</p>
    </Wrapper3>
  );
}
type TextTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TextText({ text, additionalClassNames = "" }: TextTextProps) {
  return (
    <div className={clsx("absolute content-stretch flex h-[16.8px] items-start top-[1.6px] w-[49.938px]", additionalClassNames)}>
      <p className="font-['Instrument_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#364153] text-[14px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        {text}
      </p>
    </div>
  );
}

function Icon() {
  return (
    <Wrapper>
      <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
    </Wrapper>
  );
}

function Heading() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Poppins:Bold',sans-serif] leading-[36px] left-0 not-italic text-[#101828] text-[30px] text-nowrap top-[0.8px]">Service Requests</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-0.2px]">Manage and track all service requests</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[64px] items-start left-0 top-0 w-[277.125px]" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Text() {
  return (
    <Wrapper2 additionalClassNames="h-[20px] w-[44.15px]">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#364153] text-[14px] text-center text-nowrap">Status</p>
    </Wrapper2>
  );
}

function StatusFilter() {
  return (
    <div className="bg-white h-[37.6px] relative rounded-[10px] shrink-0 w-[101.75px]" data-name="StatusFilter">
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pl-[16.8px] pr-[0.8px] py-[0.8px] relative size-full">
        <Text />
        <Icon />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <Wrapper4>
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#364153] text-[14px] top-[0.6px] w-[100px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Scheduled For:
      </p>
      <TextText text="All time" additionalClassNames="left-[99.1px]" />
    </Wrapper4>
  );
}

function DateFilter() {
  return (
    <DateFilter2 additionalClassNames="w-[206.637px]">
      <Text1 />
      <Icon />
    </DateFilter2>
  );
}

function Text2() {
  return (
    <Wrapper4>
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#364153] text-[14px] top-[0.6px] w-[59px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Created:
      </p>
      <TextText text="All time" additionalClassNames="left-[58.38px]" />
    </Wrapper4>
  );
}

function DateFilter1() {
  return (
    <DateFilter2 additionalClassNames="w-[200px]">
      <Text2 />
      <Icon />
    </DateFilter2>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[16px] h-[37.6px] items-center relative shrink-0 w-full" data-name="Container">
      <StatusFilter />
      <DateFilter />
      <DateFilter1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[70.4px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[0.8px] pt-[16px] px-[16px] relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center left-[24px] top-[22px] w-[73.675px]" data-name="Button">
      <TextText1 text="Created" additionalClassNames="w-[57.675px]" />
      <Container3 />
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute h-[64.4px] left-0 top-0 w-[121.75px]" data-name="Header Cell">
      <Button />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[40px] relative shrink-0 w-[94.088px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Poppins:Medium',sans-serif] leading-[20px] left-[47.05px] not-italic text-[#364153] text-[14px] text-center top-0 translate-x-[-50%] w-[75px]">Scheduled For</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[40px] items-center left-[24px] top-[12px] w-[110.088px]" data-name="Button">
      <Text3 />
      <Container3 />
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute h-[64.4px] left-[121.75px] top-0 w-[158.088px]" data-name="Header Cell">
      <Button1 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center left-[24px] top-[22px] w-[57.15px]" data-name="Button">
      <TextText1 text="Client" additionalClassNames="w-[41.15px]" />
      <Container3 />
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute h-[64.4px] left-[279.84px] top-0 w-[151.163px]" data-name="Header Cell">
      <Button2 />
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[34.237px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[17px] text-[#364153] text-[14px] text-center text-nowrap top-[-0.4px] translate-x-[-50%]">Status</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center left-[24px] top-[22px] w-[50.237px]" data-name="Button">
      <Text4 />
      <Container3 />
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute h-[64.4px] left-[839.01px] top-0 w-[165.6px]" data-name="Header Cell">
      <Button3 />
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute h-[64.4px] left-0 top-0 w-[1200.8px]" data-name="Table Row">
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
      <HeaderCellText text="Appliance" additionalClassNames="left-[431px] w-[171.675px]" />
      <HeaderCellText text="Issue" additionalClassNames="left-[602.67px] w-[236.338px]" />
      <HeaderCell3 />
      <HeaderCellText text="Actions" additionalClassNames="left-[1004.61px] w-[196.188px]" />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute bg-[#f9fafb] border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[64.4px] left-0 top-0 w-[1200.8px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[84.775px] left-0 top-0 w-[121.75px]" data-name="Table Cell">
      <ContainerText text="Jan 2, 2026" additionalClassNames="top-[24.39px]" />
      <ContainerText1 text="9:30 AM" additionalClassNames="top-[44.39px] w-[73.75px]" />
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[84.775px] left-[121.75px] top-0 w-[158.088px]" data-name="Table Cell">
      <ContainerText2 text="Jan 8, 2026" additionalClassNames="top-[24.39px] w-[110.088px]" />
      <ContainerText1 text="2:00 PM" additionalClassNames="top-[44.39px] w-[110.088px]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute h-[31.975px] left-[24px] top-[36.4px] w-[123.675px]" data-name="Container">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-0.8px] w-[78px]">Samsung RT38K5032S8</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[84.775px] left-[431px] top-0 w-[171.675px]" data-name="Table Cell">
      <ContainerText3 text="Refrigerator" additionalClassNames="top-[16.4px]" />
      <Container4 />
    </div>
  );
}

function Dropdown() {
  return (
    <div className="absolute bg-[#dbeafe] h-[26.4px] left-[24px] rounded-[2.68435e+07px] top-[29.19px] w-[117.6px]" data-name="Dropdown">
      <OptionText text="New" additionalClassNames="top-[-283.99px]" />
      <OptionText text="Confirmed" additionalClassNames="top-[-283.99px]" />
      <OptionText text="Pending" additionalClassNames="top-[-283.99px]" />
      <OptionText text="In Progress" additionalClassNames="top-[-283.99px]" />
      <OptionText text="Completed" additionalClassNames="top-[-283.99px]" />
      <OptionText text="Canceled" additionalClassNames="top-[-283.99px]" />
      <OptionText text="No-show" additionalClassNames="top-[-283.99px]" />
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[84.775px] left-[839.01px] top-0 w-[165.6px]" data-name="Table Cell">
      <Dropdown />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[#1e2f4f] content-stretch flex gap-[8px] h-[36px] items-center left-[24px] pl-[20px] pr-0 py-0 rounded-[10px] top-[24.39px] w-[148.15px]" data-name="Button">
      <Icon3 />
      <TextText2 text="View Details" />
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[84.775px] left-[1004.61px] top-0 w-[196.188px]" data-name="Table Cell">
      <Button4 />
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[84.775px] left-[279.84px] top-0 w-[151.163px]" data-name="Table Cell">
      <ContainerText2 text="Maria Santos" additionalClassNames="top-[32.39px] w-[103.162px]" />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[84.775px] left-0 top-0 w-[1200.8px]" data-name="Table Row">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCellText text="Not cooling properly" />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[72.8px] left-0 top-0 w-[121.75px]" data-name="Table Cell">
      <ContainerText text="Jan 3, 2026" additionalClassNames="top-[18.4px]" />
      <ContainerText1 text="10:15 AM" additionalClassNames="top-[38.4px] w-[73.75px]" />
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[72.8px] left-[121.75px] top-0 w-[158.088px]" data-name="Table Cell">
      <ContainerText2 text="Jan 9, 2026" additionalClassNames="top-[18.4px] w-[110.088px]" />
      <ContainerText1 text="10:00 AM" additionalClassNames="top-[38.4px] w-[110.088px]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[15.988px] left-[24px] top-[38.4px] w-[123.675px]" data-name="Container">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-0.8px] w-[90px]">LG WM3998HBA</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[72.8px] left-[431px] top-0 w-[171.675px]" data-name="Table Cell">
      <ContainerText3 text="Washing Machine" additionalClassNames="top-[18.4px]" />
      <Container5 />
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[72.8px] left-[602.67px] top-0 w-[236.338px]" data-name="Table Cell">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[20px] left-[24px] text-[#364153] text-[14px] top-[16.4px] w-[186px]">Makes loud noise during spin cycle</p>
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="absolute bg-[#dcfce7] h-[26.4px] left-[24px] rounded-[2.68435e+07px] top-[23.2px] w-[117.6px]" data-name="Dropdown">
      <OptionText1 text="New" additionalClassNames="top-[-362.77px]" />
      <OptionText1 text="Confirmed" additionalClassNames="top-[-362.77px]" />
      <OptionText1 text="Pending" additionalClassNames="top-[-362.77px]" />
      <OptionText1 text="In Progress" additionalClassNames="top-[-362.77px]" />
      <OptionText1 text="Completed" additionalClassNames="top-[-362.77px]" />
      <OptionText1 text="Canceled" additionalClassNames="top-[-362.77px]" />
      <OptionText1 text="No-show" additionalClassNames="top-[-362.77px]" />
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[72.8px] left-[839.01px] top-0 w-[165.6px]" data-name="Table Cell">
      <Dropdown1 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[#1e2f4f] content-stretch flex gap-[8px] h-[36px] items-center left-[24px] pl-[20px] pr-0 py-0 rounded-[10px] top-[18.4px] w-[148.15px]" data-name="Button">
      <Icon3 />
      <TextText2 text="View Details" />
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[72.8px] left-[1004.61px] top-0 w-[196.188px]" data-name="Table Cell">
      <Button5 />
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[72.8px] left-[279.84px] top-0 w-[151.163px]" data-name="Table Cell">
      <ContainerText2 text="Juan Dela Cruz" additionalClassNames="top-[26.4px] w-[103.162px]" />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[72.8px] left-0 top-[84.78px] w-[1200.8px]" data-name="Table Row">
      <TableCell6 />
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
      <TableCell10 />
      <TableCell11 />
      <TableCell12 />
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[68.8px] left-0 top-0 w-[121.75px]" data-name="Table Cell">
      <ContainerText text="Jan 4, 2026" additionalClassNames="top-[16.4px]" />
      <ContainerText1 text="11:20 AM" additionalClassNames="top-[36.4px] w-[73.75px]" />
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[68.8px] left-[121.75px] top-0 w-[158.088px]" data-name="Table Cell">
      <ContainerText2 text="Jan 10, 2026" additionalClassNames="top-[16.4px] w-[110.088px]" />
      <ContainerText1 text="4:00 PM" additionalClassNames="top-[36.4px] w-[110.088px]" />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[15.988px] left-[24px] top-[36.4px] w-[123.675px]" data-name="Container">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-0.8px] w-[88px]">Carrier X-Series</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[68.8px] left-[431px] top-0 w-[171.675px]" data-name="Table Cell">
      <ContainerText3 text="Air Conditioner" additionalClassNames="top-[16.4px]" />
      <Container6 />
    </div>
  );
}

function Dropdown2() {
  return (
    <div className="absolute bg-[#fef9c2] h-[26.4px] left-[24px] rounded-[2.68435e+07px] top-[21.2px] w-[117.6px]" data-name="Dropdown">
      <OptionText2 text="New" />
      <OptionText2 text="Confirmed" />
      <OptionText2 text="Pending" />
      <OptionText2 text="In Progress" />
      <OptionText2 text="Completed" />
      <OptionText2 text="Canceled" />
      <OptionText2 text="No-show" />
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[68.8px] left-[839.01px] top-0 w-[165.6px]" data-name="Table Cell">
      <Dropdown2 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-[#1e2f4f] content-stretch flex gap-[8px] h-[36px] items-center left-[24px] pl-[20px] pr-0 py-0 rounded-[10px] top-[16.4px] w-[148.15px]" data-name="Button">
      <Icon3 />
      <TextText2 text="View Details" />
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[68.8px] left-[1004.61px] top-0 w-[196.188px]" data-name="Table Cell">
      <Button6 />
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[68.8px] left-[279.84px] top-0 w-[151.163px]" data-name="Table Cell">
      <ContainerText2 text="Anna Reyes" additionalClassNames="top-[24.4px] w-[103.162px]" />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[68.8px] left-0 top-[157.57px] w-[1200.8px]" data-name="Table Row">
      <TableCell13 />
      <TableCell14 />
      <TableCell15 />
      <TableCellText1 text="Water leaking from unit" />
      <TableCell16 />
      <TableCell17 />
      <TableCell18 />
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[84.775px] left-0 top-0 w-[121.75px]" data-name="Table Cell">
      <ContainerText text="Jan 5, 2026" additionalClassNames="top-[24.39px]" />
      <ContainerText1 text="8:45 AM" additionalClassNames="top-[44.39px] w-[73.75px]" />
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[84.775px] left-[121.75px] top-0 w-[158.088px]" data-name="Table Cell">
      <ContainerText2 text="Jan 11, 2026" additionalClassNames="top-[24.39px] w-[110.088px]" />
      <ContainerText1 text="9:00 AM" additionalClassNames="top-[44.39px] w-[110.088px]" />
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[84.775px] left-[431px] top-0 w-[171.675px]" data-name="Table Cell">
      <ContainerText3 text="Microwave" additionalClassNames="top-[16.4px]" />
      <ContainerText4 text="Panasonic NN-SN966S" additionalClassNames="h-[31.975px]" />
    </div>
  );
}

function Dropdown3() {
  return (
    <div className="absolute bg-[#f3e8ff] h-[26.4px] left-[24px] rounded-[2.68435e+07px] top-[29.19px] w-[117.6px]" data-name="Dropdown">
      <OptionText3 text="New" additionalClassNames="top-[-510.36px]" />
      <OptionText3 text="Confirmed" additionalClassNames="top-[-510.36px]" />
      <OptionText3 text="Pending" additionalClassNames="top-[-510.36px]" />
      <OptionText3 text="In Progress" additionalClassNames="top-[-510.36px]" />
      <OptionText3 text="Completed" additionalClassNames="top-[-510.36px]" />
      <OptionText3 text="Canceled" additionalClassNames="top-[-510.36px]" />
      <OptionText3 text="No-show" additionalClassNames="top-[-510.36px]" />
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[84.775px] left-[839.01px] top-0 w-[165.6px]" data-name="Table Cell">
      <Dropdown3 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[#1e2f4f] content-stretch flex gap-[8px] h-[36px] items-center left-[24px] pl-[20px] pr-0 py-0 rounded-[10px] top-[24.39px] w-[148.15px]" data-name="Button">
      <Icon3 />
      <TextText2 text="View Details" />
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[84.775px] left-[1004.61px] top-0 w-[196.188px]" data-name="Table Cell">
      <Button7 />
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[84.775px] left-[279.84px] top-0 w-[151.163px]" data-name="Table Cell">
      <ContainerText2 text="Roberto Garcia" additionalClassNames="top-[32.39px] w-[103.162px]" />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[84.775px] left-0 top-[226.38px] w-[1200.8px]" data-name="Table Row">
      <TableCell19 />
      <TableCell20 />
      <TableCell21 />
      <TableCellText text="Display not working" />
      <TableCell22 />
      <TableCell23 />
      <TableCell24 />
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[68.8px] left-0 top-0 w-[121.75px]" data-name="Table Cell">
      <ContainerText2 text="Jan 1, 2026" additionalClassNames="top-[16.4px] w-[73.75px]" />
      <ContainerText1 text="2:30 PM" additionalClassNames="top-[36.4px] w-[73.75px]" />
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[68.8px] left-[121.75px] top-0 w-[158.088px]" data-name="Table Cell">
      <ContainerText2 text="Jan 7, 2026" additionalClassNames="top-[16.4px] w-[110.088px]" />
      <ContainerText1 text="11:00 AM" additionalClassNames="top-[36.4px] w-[110.088px]" />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[15.988px] left-[24px] top-[36.4px] w-[123.675px]" data-name="Container">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-0.8px] w-[113px]">Bosch SHPM88Z75N</p>
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[68.8px] left-[431px] top-0 w-[171.675px]" data-name="Table Cell">
      <ContainerText3 text="Dishwasher" additionalClassNames="top-[16.4px]" />
      <Container7 />
    </div>
  );
}

function Dropdown4() {
  return (
    <div className="absolute bg-[#f3f4f6] h-[26.4px] left-[24px] rounded-[2.68435e+07px] top-[21.2px] w-[117.6px]" data-name="Dropdown">
      <OptionText4 text="New" />
      <OptionText4 text="Confirmed" />
      <OptionText4 text="Pending" />
      <OptionText4 text="In Progress" />
      <OptionText4 text="Completed" />
      <OptionText4 text="Canceled" />
      <OptionText4 text="No-show" />
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[68.8px] left-[839.01px] top-0 w-[165.6px]" data-name="Table Cell">
      <Dropdown4 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-[#1e2f4f] content-stretch flex gap-[8px] h-[36px] items-center left-[24px] pl-[20px] pr-0 py-0 rounded-[10px] top-[16.4px] w-[148.15px]" data-name="Button">
      <Icon3 />
      <TextText2 text="View Details" />
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[68.8px] left-[1004.61px] top-0 w-[196.188px]" data-name="Table Cell">
      <Button8 />
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[68.8px] left-[279.84px] top-0 w-[151.163px]" data-name="Table Cell">
      <ContainerText2 text="Carmen Lopez" additionalClassNames="top-[24.4px] w-[103.162px]" />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[68.8px] left-0 top-[311.15px] w-[1200.8px]" data-name="Table Row">
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
      <TableCellText1 text="Not draining water" />
      <TableCell28 />
      <TableCell29 />
      <TableCell30 />
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[84.775px] left-0 top-0 w-[121.75px]" data-name="Table Cell">
      <ContainerText text="Jan 3, 2026" additionalClassNames="top-[24.39px]" />
      <ContainerText1 text="4:00 PM" additionalClassNames="top-[44.39px] w-[73.75px]" />
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[84.775px] left-[121.75px] top-0 w-[158.088px]" data-name="Table Cell">
      <ContainerText2 text="Jan 9, 2026" additionalClassNames="top-[24.39px] w-[110.088px]" />
      <ContainerText1 text="3:00 PM" additionalClassNames="top-[44.39px] w-[110.088px]" />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[31.975px] left-[24px] top-[36.4px] w-[123.675px]" data-name="Container">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-0.8px] w-[70px]">Whirlpool WED4815EW</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[84.775px] left-[431px] top-0 w-[171.675px]" data-name="Table Cell">
      <ContainerText3 text="Dryer" additionalClassNames="top-[16.4px]" />
      <Container8 />
    </div>
  );
}

function Dropdown5() {
  return (
    <div className="absolute bg-[#ffe2e2] h-[26.4px] left-[24px] rounded-[2.68435e+07px] top-[29.19px] w-[117.6px]" data-name="Dropdown">
      <OptionText5 text="New" />
      <OptionText5 text="Confirmed" />
      <OptionText5 text="Pending" />
      <OptionText5 text="In Progress" />
      <OptionText5 text="Completed" />
      <OptionText5 text="Canceled" />
      <OptionText5 text="No-show" />
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[84.775px] left-[839.01px] top-0 w-[165.6px]" data-name="Table Cell">
      <Dropdown5 />
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute bg-[#1e2f4f] content-stretch flex gap-[8px] h-[36px] items-center left-[24px] pl-[20px] pr-0 py-0 rounded-[10px] top-[24.39px] w-[148.15px]" data-name="Button">
      <Icon3 />
      <TextText2 text="View Details" />
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute h-[84.775px] left-[1004.61px] top-0 w-[196.188px]" data-name="Table Cell">
      <Button9 />
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute h-[84.775px] left-[279.84px] top-0 w-[151.163px]" data-name="Table Cell">
      <ContainerText2 text="Pedro Ramos" additionalClassNames="top-[32.39px] w-[103.162px]" />
    </div>
  );
}

function TableRow6() {
  return (
    <div className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[84.775px] left-0 top-[379.95px] w-[1200.8px]" data-name="Table Row">
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCellText text="Not heating" />
      <TableCell34 />
      <TableCell35 />
      <TableCell36 />
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute h-[68.8px] left-0 top-0 w-[121.75px]" data-name="Table Cell">
      <ContainerText text="Jan 4, 2026" additionalClassNames="top-[16.4px]" />
      <ContainerText1 text="1:15 PM" additionalClassNames="top-[36.4px] w-[73.75px]" />
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute h-[68.8px] left-[121.75px] top-0 w-[158.088px]" data-name="Table Cell">
      <ContainerText2 text="Jan 10, 2026" additionalClassNames="top-[16.4px] w-[110.088px]" />
      <ContainerText1 text="1:00 PM" additionalClassNames="top-[36.4px] w-[110.088px]" />
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute h-[68.8px] left-[431px] top-0 w-[171.675px]" data-name="Table Cell">
      <ContainerText3 text="Oven" additionalClassNames="top-[16.4px]" />
      <ContainerText4 text="GE JB655SKSS" additionalClassNames="h-[15.988px]" />
    </div>
  );
}

function Dropdown6() {
  return (
    <div className="absolute bg-[#ffedd4] h-[26.4px] left-[24px] rounded-[2.68435e+07px] top-[21.2px] w-[117.6px]" data-name="Dropdown">
      <OptionText6 text="New" />
      <OptionText6 text="Confirmed" />
      <OptionText6 text="Pending" />
      <OptionText6 text="In Progress" />
      <OptionText6 text="Completed" />
      <OptionText6 text="Canceled" />
      <OptionText6 text="No-show" />
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute h-[68.8px] left-[839.01px] top-0 w-[165.6px]" data-name="Table Cell">
      <Dropdown6 />
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute bg-[#1e2f4f] content-stretch flex gap-[8px] h-[36px] items-center left-[24px] pl-[20px] pr-0 py-0 rounded-[10px] top-[16.4px] w-[148.15px]" data-name="Button">
      <Icon3 />
      <TextText2 text="View Details" />
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute h-[68.8px] left-[1004.61px] top-0 w-[196.188px]" data-name="Table Cell">
      <Button10 />
    </div>
  );
}

function TableCell42() {
  return (
    <div className="absolute h-[68.8px] left-[279.84px] top-0 w-[151.163px]" data-name="Table Cell">
      <ContainerText2 text="Sofia Martinez" additionalClassNames="top-[24.4px] w-[103.162px]" />
    </div>
  );
}

function TableRow7() {
  return (
    <div className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[68.8px] left-0 top-[464.73px] w-[1200.8px]" data-name="Table Row">
      <TableCell37 />
      <TableCell38 />
      <TableCell39 />
      <TableCellText1 text="Temperature not accurate" />
      <TableCell40 />
      <TableCell41 />
      <TableCell42 />
    </div>
  );
}

function TableCell43() {
  return (
    <div className="absolute h-[68.8px] left-0 top-0 w-[121.75px]" data-name="Table Cell">
      <ContainerText text="Jan 5, 2026" additionalClassNames="top-[16.4px]" />
      <ContainerText1 text="3:45 PM" additionalClassNames="top-[36.4px] w-[73.75px]" />
    </div>
  );
}

function TableCell44() {
  return (
    <div className="absolute h-[68.8px] left-[121.75px] top-0 w-[158.088px]" data-name="Table Cell">
      <ContainerText2 text="Jan 12, 2026" additionalClassNames="top-[16.4px] w-[110.088px]" />
      <ContainerText1 text="10:00 AM" additionalClassNames="top-[36.4px] w-[110.088px]" />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[15.988px] left-[24px] top-[36.4px] w-[123.675px]" data-name="Container">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-0.8px] w-[103px]">Haier HRF15N3AGS</p>
    </div>
  );
}

function TableCell45() {
  return (
    <div className="absolute h-[68.8px] left-[431px] top-0 w-[171.675px]" data-name="Table Cell">
      <ContainerText3 text="Refrigerator" additionalClassNames="top-[16.4px]" />
      <Container9 />
    </div>
  );
}

function Dropdown7() {
  return (
    <div className="absolute bg-[#dbeafe] h-[26.4px] left-[24px] rounded-[2.68435e+07px] top-[21.2px] w-[117.6px]" data-name="Dropdown">
      <OptionText text="New" additionalClassNames="top-[-809.53px]" />
      <OptionText text="Confirmed" additionalClassNames="top-[-809.53px]" />
      <OptionText text="Pending" additionalClassNames="top-[-809.53px]" />
      <OptionText text="In Progress" additionalClassNames="top-[-809.53px]" />
      <OptionText text="Completed" additionalClassNames="top-[-809.53px]" />
      <OptionText text="Canceled" additionalClassNames="top-[-809.53px]" />
      <OptionText text="No-show" additionalClassNames="top-[-809.53px]" />
    </div>
  );
}

function TableCell46() {
  return (
    <div className="absolute h-[68.8px] left-[839.01px] top-0 w-[165.6px]" data-name="Table Cell">
      <Dropdown7 />
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute bg-[#1e2f4f] content-stretch flex gap-[8px] h-[36px] items-center left-[24px] pl-[20px] pr-0 py-0 rounded-[10px] top-[16.4px] w-[148.15px]" data-name="Button">
      <Icon3 />
      <TextText2 text="View Details" />
    </div>
  );
}

function TableCell47() {
  return (
    <div className="absolute h-[68.8px] left-[1004.61px] top-0 w-[196.188px]" data-name="Table Cell">
      <Button11 />
    </div>
  );
}

function TableCell48() {
  return (
    <div className="absolute h-[68.8px] left-[279.84px] top-0 w-[151.163px]" data-name="Table Cell">
      <ContainerText2 text="Diego Torres" additionalClassNames="top-[24.4px] w-[103.162px]" />
    </div>
  );
}

function TableRow8() {
  return (
    <div className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[68.8px] left-0 top-[533.53px] w-[1200.8px]" data-name="Table Row">
      <TableCell43 />
      <TableCell44 />
      <TableCell45 />
      <TableCellText1 text="Ice maker not working" />
      <TableCell46 />
      <TableCell47 />
      <TableCell48 />
    </div>
  );
}

function TableCell49() {
  return (
    <div className="absolute h-[88.787px] left-0 top-0 w-[121.75px]" data-name="Table Cell">
      <ContainerText5 text="Jan 6, 2026" />
      <ContainerText1 text="9:00 AM" additionalClassNames="top-[56.4px] w-[73.75px]" />
    </div>
  );
}

function TableCell50() {
  return (
    <div className="absolute h-[88.787px] left-[121.75px] top-0 w-[158.088px]" data-name="Table Cell">
      <ContainerText2 text="Jan 6, 2026" additionalClassNames="top-[26.4px] w-[110.088px]" />
      <ContainerText1 text="2:00 PM" additionalClassNames="top-[46.4px] w-[110.088px]" />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute h-[15.988px] left-[24px] top-[46.4px] w-[123.675px]" data-name="Container">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-0.8px] w-[109px]">Sony XBR-55X900H</p>
    </div>
  );
}

function TableCell51() {
  return (
    <div className="absolute h-[88.787px] left-[431px] top-0 w-[171.675px]" data-name="Table Cell">
      <ContainerText3 text="Television" additionalClassNames="top-[26.4px]" />
      <Container10 />
    </div>
  );
}

function Dropdown8() {
  return (
    <div className="absolute bg-[#dcfce7] h-[26.4px] left-[24px] rounded-[2.68435e+07px] top-[31.19px] w-[117.6px]" data-name="Dropdown">
      <OptionText1 text="New" additionalClassNames="top-[-888.31px]" />
      <OptionText1 text="Confirmed" additionalClassNames="top-[-888.31px]" />
      <OptionText1 text="Pending" additionalClassNames="top-[-888.31px]" />
      <OptionText1 text="In Progress" additionalClassNames="top-[-888.31px]" />
      <OptionText1 text="Completed" additionalClassNames="top-[-888.31px]" />
      <OptionText1 text="Canceled" additionalClassNames="top-[-888.31px]" />
      <OptionText1 text="No-show" additionalClassNames="top-[-888.31px]" />
    </div>
  );
}

function TableCell52() {
  return (
    <div className="absolute h-[88.787px] left-[839.01px] top-0 w-[165.6px]" data-name="Table Cell">
      <Dropdown8 />
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute bg-[#1e2f4f] content-stretch flex gap-[8px] h-[36px] items-center left-[24px] pl-[20px] pr-0 py-0 rounded-[10px] top-[26.39px] w-[148.15px]" data-name="Button">
      <Icon3 />
      <TextText2 text="View Details" />
    </div>
  );
}

function TableCell53() {
  return (
    <div className="absolute h-[88.787px] left-[1004.61px] top-0 w-[196.188px]" data-name="Table Cell">
      <Button12 />
    </div>
  );
}

function TableCell54() {
  return (
    <div className="absolute h-[88.787px] left-[279.84px] top-0 w-[151.163px]" data-name="Table Cell">
      <ContainerText2 text="Isabella Cruz" additionalClassNames="top-[34.39px] w-[103.162px]" />
    </div>
  );
}

function TableRow9() {
  return (
    <div className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid h-[88.787px] left-0 top-[602.33px] w-[1200.8px]" data-name="Table Row">
      <TableCell49 />
      <TableCell50 />
      <TableCell51 />
      <TableCellText2 text="No picture, sound only" additionalClassNames="h-[88.787px]" />
      <TableCell52 />
      <TableCell53 />
      <TableCell54 />
    </div>
  );
}

function TableCell55() {
  return (
    <div className="absolute h-[88.388px] left-0 top-0 w-[121.75px]" data-name="Table Cell">
      <ContainerText5 text="Jan 6, 2026" />
      <ContainerText1 text="10:30 AM" additionalClassNames="top-[56.4px] w-[73.75px]" />
    </div>
  );
}

function TableCell56() {
  return (
    <div className="absolute h-[88.388px] left-[121.75px] top-0 w-[158.088px]" data-name="Table Cell">
      <ContainerText2 text="Jan 7, 2026" additionalClassNames="top-[26.4px] w-[110.088px]" />
      <ContainerText1 text="9:00 AM" additionalClassNames="top-[46.4px] w-[110.088px]" />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[31.975px] left-[24px] top-[38.4px] w-[123.675px]" data-name="Container">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-0.8px] w-[83px]">Samsung WA50R5400AV</p>
    </div>
  );
}

function TableCell57() {
  return (
    <div className="absolute h-[88.388px] left-[431px] top-0 w-[171.675px]" data-name="Table Cell">
      <ContainerText3 text="Washing Machine" additionalClassNames="top-[18.4px]" />
      <Container11 />
    </div>
  );
}

function Dropdown9() {
  return (
    <div className="absolute bg-[#f3e8ff] h-[26.4px] left-[24px] rounded-[2.68435e+07px] top-[31.19px] w-[117.6px]" data-name="Dropdown">
      <OptionText3 text="New" additionalClassNames="top-[-977.1px]" />
      <OptionText3 text="Confirmed" additionalClassNames="top-[-977.1px]" />
      <OptionText3 text="Pending" additionalClassNames="top-[-977.1px]" />
      <OptionText3 text="In Progress" additionalClassNames="top-[-977.1px]" />
      <OptionText3 text="Completed" additionalClassNames="top-[-977.1px]" />
      <OptionText3 text="Canceled" additionalClassNames="top-[-977.1px]" />
      <OptionText3 text="No-show" additionalClassNames="top-[-977.1px]" />
    </div>
  );
}

function TableCell58() {
  return (
    <div className="absolute h-[88.388px] left-[839.01px] top-0 w-[165.6px]" data-name="Table Cell">
      <Dropdown9 />
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute bg-[#1e2f4f] content-stretch flex gap-[8px] h-[36px] items-center left-[24px] pl-[20px] pr-0 py-0 rounded-[10px] top-[26.39px] w-[148.15px]" data-name="Button">
      <Icon3 />
      <TextText2 text="View Details" />
    </div>
  );
}

function TableCell59() {
  return (
    <div className="absolute h-[88.388px] left-[1004.61px] top-0 w-[196.188px]" data-name="Table Cell">
      <Button13 />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute h-[40px] left-[24px] top-[24.39px] w-[103.162px]" data-name="Container">
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#101828] text-[14px] top-0 w-[69px]">Miguel Fernandez</p>
    </div>
  );
}

function TableCell60() {
  return (
    <div className="absolute h-[88.388px] left-[279.84px] top-0 w-[151.163px]" data-name="Table Cell">
      <Container12 />
    </div>
  );
}

function TableRow10() {
  return (
    <div className="absolute h-[88.388px] left-0 top-[691.11px] w-[1200.8px]" data-name="Table Row">
      <TableCell55 />
      <TableCell56 />
      <TableCell57 />
      <TableCellText2 text="Not spinning" additionalClassNames="h-[88.388px]" />
      <TableCell58 />
      <TableCell59 />
      <TableCell60 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[779.5px] left-0 top-[64.4px] w-[1200.8px]" data-name="Table Body">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
      <TableRow5 />
      <TableRow6 />
      <TableRow7 />
      <TableRow8 />
      <TableRow9 />
      <TableRow10 />
    </div>
  );
}

function Table() {
  return (
    <div className="h-[843.9px] overflow-clip relative shrink-0 w-full" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Text5() {
  return (
    <Wrapper2 additionalClassNames="h-[20px] w-[98.488px]">
      <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px] text-nowrap">Rows per page:</p>
    </Wrapper2>
  );
}

function Dropdown10() {
  return (
    <div className="h-[30.4px] relative rounded-[10px] shrink-0 w-[62.4px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.8px] pl-[-418.488px] pr-[480.888px] pt-[-1051.1px] relative size-full">
        <OptionText7 text="10" />
        <OptionText7 text="25" />
        <OptionText7 text="50" />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[57.65px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#364153] text-[14px] top-0 w-[58px]">1-10 of 12</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <Container22 additionalClassNames="h-[30.4px] w-[250.538px]">
      <Text5 />
      <Dropdown10 />
      <Text6 />
    </Container22>
  );
}

function Button14() {
  return (
    <Button23 additionalClassNames="opacity-50 w-[84.138px]">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[20px] left-[42.3px] not-italic text-[#0a0a0a] text-[14px] text-center text-nowrap top-[4.8px] translate-x-[-50%]">Previous</p>
    </Button23>
  );
}

function Button15() {
  return (
    <div className="bg-[#1e2f4f] h-[28px] relative rounded-[10px] shrink-0 w-[28.488px]" data-name="Button">
      <Text8 text="1" additionalClassNames="px-[12px] py-[4px]" />
    </div>
  );
}

function Button16() {
  return (
    <Button23 additionalClassNames="w-[33.65px]">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[20px] left-[17.3px] not-italic text-[#0a0a0a] text-[14px] text-center text-nowrap top-[4.8px] translate-x-[-50%]">2</p>
    </Button23>
  );
}

function Button17() {
  return (
    <Button23 additionalClassNames="w-[55.925px]">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[20px] left-[28.3px] not-italic text-[#0a0a0a] text-[14px] text-center text-nowrap top-[4.8px] translate-x-[-50%]">Next</p>
    </Button23>
  );
}

function Container14() {
  return (
    <Container22 additionalClassNames="h-[29.6px] w-[226.2px]">
      <Button14 />
      <Button15 />
      <Button16 />
      <Button17 />
    </Container22>
  );
}

function Container15() {
  return (
    <div className="h-[63.2px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-0 pt-[0.8px] px-[24px] relative size-full">
          <Container13 />
          <Container14 />
        </div>
      </div>
    </div>
  );
}

function ServiceRequestsListView() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[977.5px] items-start left-0 rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[88px] w-[1200.8px]" data-name="ServiceRequestsListView">
      <Container2 />
      <Table />
      <Container15 />
    </div>
  );
}

function ServiceRequests() {
  return (
    <div className="bg-[#f9fafb] h-[1065.5px] relative shrink-0 w-[1200.8px]" data-name="ServiceRequests">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container />
        <ServiceRequestsListView />
      </div>
    </div>
  );
}

function TechnicianDashboard() {
  return (
    <div className="bg-[#f9fafb] h-[1129.5px] relative shrink-0 w-full" data-name="TechnicianDashboard">
      <div className="content-stretch flex items-start pb-0 pl-[288px] pr-0 pt-[32px] relative size-full">
        <ServiceRequests />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex flex-col h-[1129.5px] items-start left-0 top-0 w-[1520.8px]" data-name="App">
      <TechnicianDashboard />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p2a12b200} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[#1e2f4f] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[0.8px]">APPLIASSIST</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[39.987px] relative shrink-0 w-[103.3px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading1 />
        <ParagraphText text="Technician Portal" />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <Container17 />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[88.8px] relative shrink-0 w-[255.2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_0.8px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.8px] pt-[24px] px-[24px] relative size-full">
        <Container18 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <Icon9>
      <path d={svgPaths.p275d2400} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      <path d={svgPaths.p260aa300} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
    </Icon9>
  );
}

function Button18() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[46.5px] items-center left-0 pl-[16px] pr-0 py-0 rounded-[10px] top-0 w-[223.2px]" data-name="Button">
      <Icon5 />
      <TextText3 text="Dashboard" additionalClassNames="w-[83.8px]" />
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[46.5px] relative shrink-0 w-full" data-name="List Item">
      <Button18 />
    </div>
  );
}

function Icon6() {
  return (
    <Icon9>
      <path d={svgPaths.p31172880} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      <path d={svgPaths.p3abdf300} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      <path d="M8.33333 7.5H6.66667" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      <path d="M13.3333 10.8333H6.66667" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      <path d="M13.3333 14.1667H6.66667" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
    </Icon9>
  );
}

function Text7() {
  return (
    <Wrapper2 additionalClassNames="h-[22.5px] w-[68.588px]">
      <p className="font-['Poppins:Regular',sans-serif] leading-[22.5px] not-italic relative shrink-0 text-[15px] text-center text-nowrap text-white">Requests</p>
    </Wrapper2>
  );
}

function Button19() {
  return (
    <div className="absolute bg-[#1e2f4f] content-stretch flex gap-[12px] h-[46.5px] items-center left-0 pl-[16px] pr-0 py-0 rounded-[10px] top-0 w-[223.2px]" data-name="Button">
      <Icon6 />
      <Text7 />
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[46.5px] relative shrink-0 w-full" data-name="List Item">
      <Button19 />
    </div>
  );
}

function Icon7() {
  return (
    <Icon9>
      <path d="M6.66667 1.66667V5" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      <path d="M13.3333 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      <path d={svgPaths.p1da67b80} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      <path d="M2.5 8.33333H17.5" id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
    </Icon9>
  );
}

function Button20() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[46.5px] items-center left-0 pl-[16px] pr-0 py-0 rounded-[10px] top-0 w-[223.2px]" data-name="Button">
      <Icon7 />
      <TextText3 text="Schedule" additionalClassNames="w-[69.55px]" />
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[46.5px] relative shrink-0 w-full" data-name="List Item">
      <Button20 />
    </div>
  );
}

function Icon8() {
  return (
    <Icon9>
      <path d={svgPaths.p1beb9580} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
      <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
    </Icon9>
  );
}

function Button21() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[46.5px] items-center left-0 pl-[16px] pr-0 py-0 rounded-[10px] top-0 w-[223.2px]" data-name="Button">
      <Icon8 />
      <TextText3 text="Profile" additionalClassNames="w-[45.5px]" />
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[46.5px] relative shrink-0 w-full" data-name="List Item">
      <Button21 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[210px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[255.2px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-0 pt-[24px] px-[16px] relative rounded-[inherit] size-full">
        <List />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[20px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Poppins:Medium',sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#101828] text-[14px]">Technician</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[15.988px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Poppins:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#99a1af] text-[12px] text-nowrap top-[0.2px]">mica@gmail.com</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[77.975px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pb-0 pt-[12px] px-[16px] relative size-full">
        <Paragraph1 />
        <ParagraphText text="Technician" />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[36px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div className="content-stretch flex items-start px-[16px] py-[8px] relative size-full">
        <p className="basis-0 font-['Poppins:Regular',sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#364153] text-[14px] text-center">Logout</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[154.775px] relative shrink-0 w-[255.2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-0 pt-[16.8px] px-[16px] relative size-full">
        <Container20 />
        <Button22 />
      </div>
    </div>
  );
}

function VerticalNavbar() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[681.6px] items-start left-0 pl-0 pr-[0.8px] py-0 top-0 w-[256px]" data-name="VerticalNavbar">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0.8px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Container19 />
      <Navigation />
      <Container21 />
    </div>
  );
}

export default function AuthenticationFlowDesign() {
  return (
    <div className="bg-white relative size-full" data-name="Authentication Flow Design">
      <App />
      <VerticalNavbar />
    </div>
  );
}