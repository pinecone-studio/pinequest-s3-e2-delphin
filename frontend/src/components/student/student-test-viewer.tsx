'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import type { MockTest } from '@/lib/mock-data'

type DemoQuestion = {
  text: string
  options?: string[]
}

type DemoTestContent = {
  duration: string
  totalMarks: string
  instructions: string[]
  pages: DemoQuestion[][]
}

const demoTestContentById: Record<string, DemoTestContent> = {
  mt1: {
    duration: '40 минут',
    totalMarks: '40',
    instructions: [
      'Асуулт бүрийг анхааралтай уншаад хариулна уу.',
      'Tag болон element нэрийг зөв бичнэ үү.',
      'Богино хариултыг ойлгомжтой, товч өгнө үү.',
      'Дууссаны дараа хариултаа дахин шалгана уу.',
    ],
    pages: [
      [
        { text: 'HTML баримтын үндсэн зорилго юу вэ?', options: ['A) Сервер удирдах', 'B) Вэб хуудасны бүтэц тодорхойлох', 'C) Зураг засах', 'D) Өгөгдлийн сан үүсгэх'] },
        { text: '`<title>` tag нь browser-ийн хаана харагддаг вэ?', options: ['A) Хуудасны үндсэн хэсэгт', 'B) Tab-ийн гарчиг дээр', 'C) Footer хэсэгт', 'D) Зөвхөн console дээр'] },
        { text: 'Догол мөр оруулахад ямар tag ашигладаг вэ?' },
      ],
      [
        { text: 'Эрэмбэлэгдээгүй жагсаалт үүсгэх tag аль нь вэ?', options: ['A) <ol>', 'B) <li>', 'C) <ul>', 'D) <dl>'] },
        { text: '`alt` attribute-ийн гол үүрэг юу вэ?', options: ['A) Зургийн хэмжээг өөрчлөх', 'B) Зураг ачаалагдахгүй үед тайлбар өгөх', 'C) Файлын нэр нуух', 'D) Өнгө тохируулах'] },
        { text: 'Semantic HTML гэж юуг хэлдэг вэ?' },
      ],
      [
        { text: 'Хүснэгтийн мөр үүсгэх tag аль нь вэ?', options: ['A) <td>', 'B) <tr>', 'C) <th>', 'D) <table-row>'] },
        { text: 'Form дотор хэрэглэгчийн текст оруулах хамгийн түгээмэл element аль нь вэ?', options: ['A) <input>', 'B) <section>', 'C) <img>', 'D) <meta>'] },
        { text: 'Inline болон block элементийн нэг нэг жишээ бич.' },
      ],
      [],
    ],
  },
  mt2: {
    duration: '35 минут',
    totalMarks: '35',
    instructions: [
      'Сонгох асуултад нэг зөв хариулт сонгоно.',
      'Property болон value-г зөв бичнэ үү.',
      'Жишээг CSS дүрэмтэй холбон тайлбарлана уу.',
      'Хариултыг аль болох цэгцтэй бичнэ үү.',
    ],
    pages: [
      [
        { text: 'CSS-ийн үндсэн зорилго юу вэ?', options: ['A) Вэбийн бүтэц тодорхойлох', 'B) Вэб хуудасны харагдах байдлыг загварчлах', 'C) Өгөгдөл хадгалах', 'D) Сервер асаах'] },
        { text: '`color` property нь юуг өөрчилдөг вэ?', options: ['A) Арын өнгө', 'B) Хүрээний өргөн', 'C) Текстийн өнгө', 'D) Өндөр'] },
        { text: 'Class selector хэрхэн бичигддэг вэ?' },
      ],
      [
        { text: '`margin` болон `padding`-ийн ялгаа юу вэ?', options: ['A) Ялгаагүй', 'B) Margin нь гаднах, padding нь дотор зай', 'C) Padding нь хүрээ, margin нь өнгө', 'D) Margin зөвхөн зурагт ашиглагдана'] },
        { text: '`display: flex` ашиглахын гол давуу тал юу вэ?', options: ['A) Зөвхөн өнгө сольдог', 'B) Элементүүдийг уян хатан байрлуулах боломж олгодог', 'C) HTML код багасгадаг', 'D) Browser хаадаг'] },
        { text: 'Hover төлөвт товчны өнгийг өөрчлөх CSS дүрэм бич.' },
      ],
      [
        { text: '`#id` selector нь юуг заадаг вэ?', options: ['A) Бүх paragraph', 'B) Тодорхой нэг id-тай element', 'C) Бүх class', 'D) Бүх link'] },
        { text: '`font-weight: bold` ямар нөлөөтэй вэ?', options: ['A) Текст налуулна', 'B) Текст тодруулна', 'C) Текст нууж өгнө', 'D) Текстийн хэмжээг 2 дахин өсгөнө'] },
        { text: 'Responsive дизайн хийхэд CSS яагаад чухал вэ?' },
      ],
      [],
    ],
  },
  mt3: {
    duration: '30 минут',
    totalMarks: '30',
    instructions: [
      'JavaScript кодын үр дүнг логикоор бодож хариулна уу.',
      'Keyword болон хувьсагчийн нэрсийг зөв бичнэ үү.',
      'Богино хариултад жишээ оруулж болно.',
      'Алдаатай синтакс байвал засаж тайлбарлана уу.',
    ],
    pages: [
      [
        { text: '`const` түлхүүр үгийг ямар үед ашиглах нь зөв бэ?', options: ['A) Утга тогтмол байх үед', 'B) Давталт зогсоох үед', 'C) HTML зурах үед', 'D) CSS импортлох үед'] },
        { text: '`===` оператор нь юу шалгадаг вэ?', options: ['A) Зөвхөн утга', 'B) Утга болон төрлийг хамтад нь', 'C) Зөвхөн төрлийг', 'D) Зөвхөн уртыг'] },
        { text: 'Array гэж юу вэ?' },
      ],
      [
        { text: '`if` нөхцөлт өгүүлбэр ямар зориулалттай вэ?', options: ['A) Давталт хийх', 'B) Нөхцөлөөс хамаарч код ажиллуулах', 'C) Файл татах', 'D) CSS бичих'] },
        { text: '`console.log()` юунд ашиглагддаг вэ?', options: ['A) Хуудас хэвлэх', 'B) Console дээр мэдээлэл харуулах', 'C) API үүсгэх', 'D) Зураг ачаалах'] },
        { text: 'Function-ийн энгийн жишээ бич.' },
      ],
      [
        { text: '`let` болон `const`-ийн ялгааг сонго.', options: ['A) Ялгаагүй', 'B) let дахин оноож болно, const болохгүй', 'C) const зөвхөн string-д ажиллана', 'D) let зөвхөн array-д ажиллана'] },
        { text: 'JavaScript жижиг, том үсэг ялгадаг уу?', options: ['A) Тийм', 'B) Үгүй'] },
        { text: 'Event гэж юу болохыг нэг өгүүлбэрээр тайлбарла.' },
      ],
      [],
    ],
  },
  mt4: {
    duration: '60 минут',
    totalMarks: '100',
    instructions: [
      'HTML, CSS, JavaScript сэдвийг хамарсан нэгдсэн шалгалт болно.',
      'Сонгох асуулт болон тайлбарлах асуултуудад бүрэн хариулна уу.',
      'Кодын жишээ бичих бол уншигдахуйц байдлаар бичнэ үү.',
      'Цагийн менежментээ анхаарч, төгсгөлд нь шалгана уу.',
    ],
    pages: [
      [
        { text: 'HTML-ийн semantic element-ийн жишээ аль нь вэ?', options: ['A) <div>', 'B) <section>', 'C) <span>', 'D) <b>'] },
        { text: 'CSS-д element-ийг төвд байрлуулах өргөн хэрэглээтэй арга аль нь вэ?', options: ['A) display: none', 'B) margin: 0 auto', 'C) opacity: 0', 'D) float: none'] },
        { text: 'JavaScript-д хэрэглэгч товч дарсан үед ажиллах үйлдлийг юу гэж нэрлэдэг вэ?' },
      ],
      [
        { text: 'Вэб хөгжүүлэлтэд frontend гэж юуг хэлэх вэ?', options: ['A) Серверийн дотоод логик', 'B) Хэрэглэгчийн хардаг хэсэг', 'C) Сүлжээний кабель', 'D) Өгөгдлийн сангийн backup'] },
        { text: 'Responsive layout хийхэд media query ямар үүрэгтэй вэ?', options: ['A) Аудио дуу оруулна', 'B) Дэлгэцийн хэмжээнээс хамаарч style өөрчилнө', 'C) JavaScript орлоно', 'D) HTML устгана'] },
        { text: 'Form submit хийх үед validation яагаад чухал вэ?' },
      ],
      [
        { text: 'DOM гэж юу вэ?', options: ['A) Database Object Model', 'B) Document Object Model', 'C) Display Order Mode', 'D) Data Output Method'] },
        { text: '`fetch()` функц ямар зориулалттай вэ?', options: ['A) CSS бичих', 'B) Сүлжээнээс өгөгдөл авах', 'C) Зураг засах', 'D) Хуудас хэвлэх'] },
        { text: 'HTML, CSS, JavaScript гурав хамтдаа яаж ажилладгийг товч тайлбарла.' },
      ],
      [],
    ],
  },
}

export function StudentTestViewer({
  currentPage,
  onPageChange,
  onDownload,
  onPrint,
  test,
  zoom,
  onZoomChange,
}: {
  currentPage: number
  onPageChange: (page: number | ((page: number) => number)) => void
  onDownload: () => void
  onPrint: () => void
  test: MockTest
  zoom: number
  onZoomChange: (value: number) => void
}) {
  const content = demoTestContentById[test.id] ?? demoTestContentById.mt1
  const totalPages = content.pages.length + 1
  const pageQuestions = currentPage > 1 ? content.pages[currentPage - 2] ?? [] : []

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <span className="font-medium">{test.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Zoom:</span>
            <Slider value={[zoom]} onValueChange={([value]) => onZoomChange(value)} min={50} max={200} step={10} className="w-24" />
            <span className="text-sm w-12">{zoom}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onDownload}>Татах</Button>
            <Button variant="outline" size="sm" onClick={onPrint}>Хэвлэх</Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-24 border-r bg-muted/20 p-2 overflow-auto">
          <div className="space-y-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => onPageChange(index + 1)}
                className={currentPage === index + 1 ? 'w-full aspect-[1/1.414] border rounded text-xs flex items-center justify-center transition-colors border-primary bg-primary/10 ring-2 ring-primary' : 'w-full aspect-[1/1.414] border rounded text-xs flex items-center justify-center transition-colors hover:bg-muted'}
              >
                <div className="text-center">
                  <div className="text-[10px] text-muted-foreground mb-1">Хуудас</div>
                  <div className="font-medium">{index + 1}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center overflow-auto bg-muted/10 p-4">
          <div className="flex items-center gap-4 mb-4 sticky top-0 bg-background/80 backdrop-blur py-2 px-4 rounded-full border">
            <Button variant="ghost" size="sm" disabled={currentPage === 1} onClick={() => onPageChange((page) => page - 1)}>
              &larr; Өмнөх
            </Button>
            <span className="text-sm">Хуудас <strong>{currentPage}</strong> / <strong>{totalPages}</strong></span>
            <Button variant="ghost" size="sm" disabled={currentPage === totalPages} onClick={() => onPageChange((page) => page + 1)}>
              Дараах &rarr;
            </Button>
          </div>

          <Card className="bg-background shadow-lg p-8 transition-transform origin-top" style={{ width: `${595 * (zoom / 100)}px`, minHeight: `${842 * (zoom / 100)}px` }}>
            <div className="h-full flex flex-col" style={{ fontSize: `${zoom}%` }}>
              {currentPage === 1 ? (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-xl font-bold mb-2">{test.name}</h1>
                    <p className="text-muted-foreground">Хугацаа: {content.duration}</p>
                    <p className="text-muted-foreground">Нийт оноо: {content.totalMarks}</p>
                  </div>
                  <div className="border-t pt-6 space-y-4">
                    <h2 className="font-semibold">Заавар:</h2>
                    <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
                      {content.instructions.map((instruction) => (
                        <li key={instruction}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {pageQuestions.map((question, index) => (
                    <QuestionBlock
                      key={`${test.id}-${currentPage}-${index}`}
                      number={(currentPage - 2) * 3 + index + 1}
                      options={question.options}
                      text={question.text}
                    />
                  ))}
                </div>
              )}
              <div className="mt-auto text-center text-sm text-muted-foreground">
                Хуудас {currentPage} / {totalPages}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function QuestionBlock({
  number,
  options,
  text,
}: {
  number: number
  options?: string[]
  text: string
}) {
  return (
    <div>
      <h3 className="font-medium mb-2">Асуулт {number}</h3>
      <p className="text-sm text-muted-foreground">{text}</p>
      {options ? (
        <div className="mt-2 ml-4 text-sm space-y-1">
          {options.map((option) => <p key={option}>{option}</p>)}
        </div>
      ) : (
        <div className="mt-2 border-b border-dashed h-12" />
      )}
    </div>
  )
}
