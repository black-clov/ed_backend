import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'questionnaire_answers' })
export class QuestionnaireAnswerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 120 })
  userId!: string;

  @Column({ type: 'jsonb' })
  interests!: string[];

  @Column({ name: 'interest_categories', type: 'jsonb', nullable: true })
  interestCategories!: Record<string, string[]>;

  @Column({ name: 'personality_answers', type: 'jsonb' })
  personalityAnswers!: Record<string, string>;

  @Column({ name: 'soft_skills_answers', type: 'jsonb', nullable: true })
  softSkillsAnswers!: Record<string, string>;

  @Column({ name: 'work_preferences', type: 'jsonb' })
  workPreferences!: string[];
}
