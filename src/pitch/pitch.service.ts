import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneratePitchDto, SavePitchDto } from './dto/pitch.dto';
import { PitchEntity } from './entities/pitch.entity';

@Injectable()
export class PitchService {
  constructor(
    @InjectRepository(PitchEntity)
    private readonly pitchRepo: Repository<PitchEntity>,
  ) {}

  getTips() {
    return [
      { key: 'hook', label: 'ابدأ بجملة قوية', icon: '🎣', description: 'ابدأ بسؤال أو إحصائية تجذب الانتباه' },
      { key: 'problem', label: 'حدد المشكل', icon: '❓', description: 'وصف المشكل اللي كيعاني منو الناس' },
      { key: 'solution', label: 'قدم الحل ديالك', icon: '💡', description: 'شرح كيفاش المشروع ديالك كيحل المشكل' },
      { key: 'value', label: 'القيمة المضافة', icon: '⭐', description: 'شنو اللي كيميز المشروع ديالك' },
      { key: 'audience', label: 'الفئة المستهدفة', icon: '🎯', description: 'شكون اللي غادي يستفاد من المشروع' },
      { key: 'call_to_action', label: 'الخطوة الجاية', icon: '🚀', description: 'ختم بطلب واضح أو خطوة عملية' },
    ];
  }

  generate(dto: GeneratePitchDto) {
    const name = dto.projectName;
    const sector = dto.sector || 'general';

    const sectorTemplates: Record<string, { hook: string; problem: string; solution: string; value: string; audience: string; cta: string }> = {
      innovation: {
        hook: `واش عمرك تساءلت كيفاش التكنولوجيا تقدر تحل مشاكل يومية؟`,
        problem: `بزاف ديال الناس كيعانيو من مشاكل تقنية فحياتهم اليومية.`,
        solution: `${name} هو مشروع مبتكر كيستعمل التكنولوجيا باش يسهل الحياة.`,
        value: `الحل ديالنا بسيط، سريع، وما كاينش بحالو فالسوق.`,
        audience: `كنستهدفو الشباب والمقاولات الصغيرة اللي بغاو يتطوروا.`,
        cta: `كنقلبو على شركاء وممولين باش نوصلو الحل لأكبر عدد ديال الناس.`,
      },
      sales: {
        hook: `السوق المغربي فيه فرص كبيرة ماشي مستغلة.`,
        problem: `بزاف ديال المنتجات ما كتوصلش للزبون المناسب.`,
        solution: `${name} كيوفر طريقة جديدة للبيع توصل المنتج للزبون بسرعة.`,
        value: `كنوفرو خدمة شخصية وجودة عالية بثمن مناسب.`,
        audience: `الزبناء ديالنا هما العائلات والتجار الصغار.`,
        cta: `ابدأ معانا اليوم وشوف الفرق فالمبيعات ديالك.`,
      },
      marketing: {
        hook: `فعصر الرقمنة، التسويق هو مفتاح النجاح.`,
        problem: `المقاولات الصغيرة ما عندهاش الأدوات باش توصل للزبناء.`,
        solution: `${name} كيقدم حلول تسويقية بسيطة وفعالة.`,
        value: `كنساعدو المقاولات تبني علامة تجارية قوية بميزانية محدودة.`,
        audience: `كنخدمو مع المقاولات الصغيرة والمتوسطة.`,
        cta: `تواصل معانا باش نبنيو استراتيجية تسويقية ناجحة.`,
      },
      manual_services: {
        hook: `الخدمات اليدوية أساس الاقتصاد المحلي.`,
        problem: `الصنايعية كيلقاو صعوبة باش يلقاو الزبناء بانتظام.`,
        solution: `${name} كيربط بين الحرفيين والزبناء بطريقة سهلة.`,
        value: `خدمة موثوقة بجودة عالية وبأثمنة معقولة.`,
        audience: `كل واحد محتاج خدمة يدوية فالدار أو الخدمة.`,
        cta: `انضم لشبكة الحرفيين ديالنا وزيد الدخل ديالك.`,
      },
      management: {
        hook: `التنظيم الجيد هو سر نجاح أي مشروع.`,
        problem: `بزاف ديال المقاولين كيضيعو الوقت فالتسيير اليومي.`,
        solution: `${name} كيوفر أدوات تسيير بسيطة وفعالة.`,
        value: `وفّر الوقت وركز على تطوير المشروع ديالك.`,
        audience: `المقاولين الشباب وأصحاب المشاريع الصغيرة.`,
        cta: `جرب الحل ديالنا مجاناً وشوف كيفاش غادي يتغير التسيير ديالك.`,
      },
      people: {
        hook: `العلاقات الإنسانية هي أقوى أداة فالأعمال.`,
        problem: `الناس محتاجين دعم وتوجيه فحياتهم المهنية.`,
        solution: `${name} كيقدم خدمات شخصية للمرافقة والتوجيه.`,
        value: `مقاربة إنسانية مبنية على الثقة والاستماع.`,
        audience: `الشباب اللي باغي يبدأ مشواره المهني.`,
        cta: `تواصل معانا باش نمشيو فهاد المشوار مع بعض.`,
      },
      general: {
        hook: `كل يوم، فرص جديدة كتبان لللي عندو الشجاعة يبدأ.`,
        problem: `بزاف ديال المشاكل اليومية مازال ما لقاو حل مناسب.`,
        solution: `${name} هو مشروع كيقدم حل عملي وبسيط لهاد المشاكل.`,
        value: `اللي كيميزنا هو البساطة والقرب من الزبون.`,
        audience: `كنستهدفو المجتمع المحلي بجميع فئاته.`,
        cta: `ساعدنا نوصلو لأكبر عدد ديال الناس. شاركنا الرحلة.`,
      },
    };

    const tpl = sectorTemplates[sector] || sectorTemplates['general'];

    const pitchText = [
      tpl.hook,
      tpl.problem,
      tpl.solution,
      tpl.value,
      tpl.audience,
      tpl.cta,
    ].join('\n\n');

    return {
      projectName: name,
      sector,
      pitchText,
      sections: {
        hook: tpl.hook,
        problem: tpl.problem,
        solution: tpl.solution,
        value: tpl.value,
        audience: tpl.audience,
        callToAction: tpl.cta,
      },
      tips: this.getTips(),
    };
  }

  async save(dto: SavePitchDto) {
    const userId = dto.userId ?? 'anonymous';
    await this.pitchRepo.delete({ userId });

    const entity = this.pitchRepo.create({
      userId,
      projectName: dto.projectName,
      pitchText: dto.pitchText,
      sector: dto.sector ?? null,
    });
    await this.pitchRepo.save(entity);
    return { ok: true, userId };
  }

  async getByUser(userId: string) {
    const row = await this.pitchRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return row ?? null;
  }
}
