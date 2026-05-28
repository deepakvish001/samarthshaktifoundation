export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alot_numbers: {
        Row: {
          center_code: string | null
          center_name: string | null
          course_examination_date: string | null
          course_name: string
          created_at: string
          director_signature_url: string | null
          id: string
          issue_date: string | null
          obtain_practical_marks: string | null
          obtain_theory_marks: string | null
          place: string | null
          practical_max_marks: string | null
          student_father_name: string | null
          student_id: string
          student_mother_name: string | null
          student_name: string | null
          student_photo_url: string | null
          theory_max_marks: string | null
          updated_at: string
        }
        Insert: {
          center_code?: string | null
          center_name?: string | null
          course_examination_date?: string | null
          course_name: string
          created_at?: string
          director_signature_url?: string | null
          id?: string
          issue_date?: string | null
          obtain_practical_marks?: string | null
          obtain_theory_marks?: string | null
          place?: string | null
          practical_max_marks?: string | null
          student_father_name?: string | null
          student_id: string
          student_mother_name?: string | null
          student_name?: string | null
          student_photo_url?: string | null
          theory_max_marks?: string | null
          updated_at?: string
        }
        Update: {
          center_code?: string | null
          center_name?: string | null
          course_examination_date?: string | null
          course_name?: string
          created_at?: string
          director_signature_url?: string | null
          id?: string
          issue_date?: string | null
          obtain_practical_marks?: string | null
          obtain_theory_marks?: string | null
          place?: string | null
          practical_max_marks?: string | null
          student_father_name?: string | null
          student_id?: string
          student_mother_name?: string | null
          student_name?: string | null
          student_photo_url?: string | null
          theory_max_marks?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      assignments: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_details: {
        Row: {
          account_number: string
          bank_name: string
          bank_photo_url: string | null
          branch_name: string
          created_at: string
          id: string
          ifsc_code: string
          micr_code: string
          updated_at: string
        }
        Insert: {
          account_number: string
          bank_name: string
          bank_photo_url?: string | null
          branch_name: string
          created_at?: string
          id?: string
          ifsc_code: string
          micr_code: string
          updated_at?: string
        }
        Update: {
          account_number?: string
          bank_name?: string
          bank_photo_url?: string | null
          branch_name?: string
          created_at?: string
          id?: string
          ifsc_code?: string
          micr_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          course_id: string
          created_at: string
          id: string
          issued_date: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certificate_number: string
          course_id: string
          created_at?: string
          id?: string
          issued_date?: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certificate_number?: string
          course_id?: string
          created_at?: string
          id?: string
          issued_date?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      class_fees: {
        Row: {
          board_university: string | null
          course_name: string
          course_type: string
          created_at: string
          duration: string | null
          fees_entry: string
          id: string
          student_cv: string | null
          updated_at: string
        }
        Insert: {
          board_university?: string | null
          course_name: string
          course_type: string
          created_at?: string
          duration?: string | null
          fees_entry: string
          id?: string
          student_cv?: string | null
          updated_at?: string
        }
        Update: {
          board_university?: string | null
          course_name?: string
          course_type?: string
          created_at?: string
          duration?: string | null
          fees_entry?: string
          id?: string
          student_cv?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      competition_courses: {
        Row: {
          created_at: string
          date: string
          description: string
          file: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description: string
          file?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          file?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_us: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      course_categories: {
        Row: {
          category_id: number
          course_category: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          category_id: number
          course_category: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          category_id?: number
          course_category?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_master: {
        Row: {
          category: string
          course_name: string
          course_sort_name: string
          created_at: string
          duration: string
          fees: string
          id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          category: string
          course_name: string
          course_sort_name: string
          created_at?: string
          duration: string
          fees: string
          id?: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          course_name?: string
          course_sort_name?: string
          created_at?: string
          duration?: string
          fees?: string
          id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      course_subjects: {
        Row: {
          course_name: string
          created_at: string
          description: string | null
          id: string
          practical_marks: string
          semester_year: string
          subject: string
          theory_marks: string
          updated_at: string
        }
        Insert: {
          course_name: string
          created_at?: string
          description?: string | null
          id?: string
          practical_marks: string
          semester_year: string
          subject: string
          theory_marks: string
          updated_at?: string
        }
        Update: {
          course_name?: string
          created_at?: string
          description?: string | null
          id?: string
          practical_marks?: string
          semester_year?: string
          subject?: string
          theory_marks?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          duration_weeks: number | null
          id: string
          instructor: string | null
          status: string | null
          title: string
          total_lessons: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          instructor?: string | null
          status?: string | null
          title: string
          total_lessons?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          instructor?: string | null
          status?: string | null
          title?: string
          total_lessons?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      day_book_entries: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          entry_date: string
          id: string
          service_name: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          entry_date: string
          id?: string
          service_name: string
          transaction_type?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          service_name?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      director_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          photo: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          photo?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          photo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      district_master: {
        Row: {
          city_id: number
          created_at: string
          created_date: string | null
          id: string
          site_id: number
          site_name: string
          updated_at: string
        }
        Insert: {
          city_id: number
          created_at?: string
          created_date?: string | null
          id?: string
          site_id: number
          site_name: string
          updated_at?: string
        }
        Update: {
          city_id?: number
          created_at?: string
          created_date?: string | null
          id?: string
          site_id?: number
          site_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          contact_no: string
          country: string | null
          created_at: string
          district: string | null
          email_id: string
          employee_id: string
          employee_password: string
          father_name: string | null
          full_name: string
          id: string
          other_details: string | null
          photo_url: string | null
          pincode: string | null
          registration_date: string | null
          salary: string | null
          state: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_no: string
          country?: string | null
          created_at?: string
          district?: string | null
          email_id: string
          employee_id: string
          employee_password: string
          father_name?: string | null
          full_name: string
          id?: string
          other_details?: string | null
          photo_url?: string | null
          pincode?: string | null
          registration_date?: string | null
          salary?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_no?: string
          country?: string | null
          created_at?: string
          district?: string | null
          email_id?: string
          employee_id?: string
          employee_password?: string
          father_name?: string | null
          full_name?: string
          id?: string
          other_details?: string | null
          photo_url?: string | null
          pincode?: string | null
          registration_date?: string | null
          salary?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          organization: string | null
          phone: string
          state: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          organization?: string | null
          phone: string
          state: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          organization?: string | null
          phone?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      expense_entries: {
        Row: {
          created_at: string
          description: string | null
          expense_date: string
          expense_name: string
          given_to: string
          id: string
          quantity: string
          service_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          expense_date: string
          expense_name: string
          given_to: string
          id?: string
          quantity: string
          service_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          expense_date?: string
          expense_name?: string
          given_to?: string
          id?: string
          quantity?: string
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      expense_master: {
        Row: {
          created_at: string
          description: string | null
          id: string
          service_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          service_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      fees_receipts: {
        Row: {
          amount_due: number
          amount_paid: number
          course: string
          created_at: string
          franchise_id: string
          franchise_name: string
          id: string
          payment_details: string | null
          receipt_date: string
          receipt_no: string
          status: string
          student: string
          student_id: string
          total_fee: number
          updated_at: string
        }
        Insert: {
          amount_due?: number
          amount_paid: number
          course: string
          created_at?: string
          franchise_id: string
          franchise_name: string
          id?: string
          payment_details?: string | null
          receipt_date: string
          receipt_no: string
          status?: string
          student: string
          student_id: string
          total_fee: number
          updated_at?: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          course?: string
          created_at?: string
          franchise_id?: string
          franchise_name?: string
          id?: string
          payment_details?: string | null
          receipt_date?: string
          receipt_no?: string
          status?: string
          student?: string
          student_id?: string
          total_fee?: number
          updated_at?: string
        }
        Relationships: []
      }
      franchise_certificates: {
        Row: {
          centre_head: string
          certificate_number: string
          certificate_type: string | null
          created_at: string
          franchise_id: string
          franchise_name: string
          id: string
          issue_date: string
          location: string
          operating_area: string
          registration_number: string
          status: string | null
          updated_at: string
          valid_from: string
          valid_to: string
        }
        Insert: {
          centre_head: string
          certificate_number: string
          certificate_type?: string | null
          created_at?: string
          franchise_id: string
          franchise_name: string
          id?: string
          issue_date?: string
          location: string
          operating_area: string
          registration_number: string
          status?: string | null
          updated_at?: string
          valid_from: string
          valid_to: string
        }
        Update: {
          centre_head?: string
          certificate_number?: string
          certificate_type?: string | null
          created_at?: string
          franchise_id?: string
          franchise_name?: string
          id?: string
          issue_date?: string
          location?: string
          operating_area?: string
          registration_number?: string
          status?: string | null
          updated_at?: string
          valid_from?: string
          valid_to?: string
        }
        Relationships: []
      }
      franchise_registrations: {
        Row: {
          antivirus: string | null
          antivirus_remark: string | null
          approval_status: string
          centre_head_name: string
          city_town_village: string | null
          connectivity_type: string | null
          created_at: string
          date_of_registration: string
          designation: string
          district_name: string
          district_sort_name: string
          documents: Json | null
          educational_qualification: string | null
          email: string
          experience: string | null
          faculty_indicate: string | null
          franchise_type: string
          gender: string | null
          head_date_of_birth: string | null
          head_district: string
          head_email: string
          head_mobile_number: string
          head_pin_code: string
          head_postal_address: string
          head_state: string
          id: string
          infrastructure_data: Json | null
          institute_full_name: string
          institute_sort_name: string
          internet_connectivity: string | null
          internet_speed: string | null
          marital_status: string | null
          mobile_country_code: string
          mobile_number: string
          number_of_faculties: string | null
          number_of_servers: string | null
          operating_system: string | null
          os_remark: string | null
          pin_code: string
          postal_address: string
          power_backup: string | null
          power_remark: string | null
          printer_remark: string | null
          printers_scanner: string | null
          religion: string | null
          server_remark: string | null
          state_name: string
          state_sort_name: string
          status: string
          type_of_faculties: string | null
          updated_at: string
          year_of_establishment: string
        }
        Insert: {
          antivirus?: string | null
          antivirus_remark?: string | null
          approval_status?: string
          centre_head_name: string
          city_town_village?: string | null
          connectivity_type?: string | null
          created_at?: string
          date_of_registration: string
          designation: string
          district_name: string
          district_sort_name: string
          documents?: Json | null
          educational_qualification?: string | null
          email: string
          experience?: string | null
          faculty_indicate?: string | null
          franchise_type: string
          gender?: string | null
          head_date_of_birth?: string | null
          head_district: string
          head_email: string
          head_mobile_number: string
          head_pin_code: string
          head_postal_address: string
          head_state: string
          id?: string
          infrastructure_data?: Json | null
          institute_full_name: string
          institute_sort_name: string
          internet_connectivity?: string | null
          internet_speed?: string | null
          marital_status?: string | null
          mobile_country_code?: string
          mobile_number: string
          number_of_faculties?: string | null
          number_of_servers?: string | null
          operating_system?: string | null
          os_remark?: string | null
          pin_code: string
          postal_address: string
          power_backup?: string | null
          power_remark?: string | null
          printer_remark?: string | null
          printers_scanner?: string | null
          religion?: string | null
          server_remark?: string | null
          state_name: string
          state_sort_name: string
          status?: string
          type_of_faculties?: string | null
          updated_at?: string
          year_of_establishment: string
        }
        Update: {
          antivirus?: string | null
          antivirus_remark?: string | null
          approval_status?: string
          centre_head_name?: string
          city_town_village?: string | null
          connectivity_type?: string | null
          created_at?: string
          date_of_registration?: string
          designation?: string
          district_name?: string
          district_sort_name?: string
          documents?: Json | null
          educational_qualification?: string | null
          email?: string
          experience?: string | null
          faculty_indicate?: string | null
          franchise_type?: string
          gender?: string | null
          head_date_of_birth?: string | null
          head_district?: string
          head_email?: string
          head_mobile_number?: string
          head_pin_code?: string
          head_postal_address?: string
          head_state?: string
          id?: string
          infrastructure_data?: Json | null
          institute_full_name?: string
          institute_sort_name?: string
          internet_connectivity?: string | null
          internet_speed?: string | null
          marital_status?: string | null
          mobile_country_code?: string
          mobile_number?: string
          number_of_faculties?: string | null
          number_of_servers?: string | null
          operating_system?: string | null
          os_remark?: string | null
          pin_code?: string
          postal_address?: string
          power_backup?: string | null
          power_remark?: string | null
          printer_remark?: string | null
          printers_scanner?: string | null
          religion?: string | null
          server_remark?: string | null
          state_name?: string
          state_sort_name?: string
          status?: string
          type_of_faculties?: string | null
          updated_at?: string
          year_of_establishment?: string
        }
        Relationships: []
      }
      head_offices: {
        Row: {
          address: string
          city: string | null
          country: string | null
          created_at: string
          created_by: string | null
          email: string
          id: string
          is_primary: boolean | null
          name: string | null
          phone: string
          postal_code: string | null
          state: string | null
          status: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          is_primary?: boolean | null
          name?: string | null
          phone: string
          postal_code?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          is_primary?: boolean | null
          name?: string | null
          phone?: string
          postal_code?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      menu_content: {
        Row: {
          course: string
          course_file: string | null
          created_at: string
          date: string
          id: string
          notes: string | null
          updated_at: string
          upload_file_title: string
        }
        Insert: {
          course: string
          course_file?: string | null
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          updated_at?: string
          upload_file_title: string
        }
        Update: {
          course?: string
          course_file?: string | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          updated_at?: string
          upload_file_title?: string
        }
        Relationships: []
      }
      missions: {
        Row: {
          content: string
          created_at: string
          id: string
          image: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          created_at: string
          id: string
          news_date: string
          news_description: string
          news_id: number
          news_title: string
          photo: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          news_date: string
          news_description: string
          news_id: number
          news_title: string
          photo?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          news_date?: string
          news_description?: string
          news_id?: number
          news_title?: string
          photo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string | null
          title: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          title: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      opening_balances: {
        Row: {
          amount: number
          created_at: string
          description: string
          entry_date: string
          id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          entry_date: string
          id?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          entry_date?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      photo_gallery: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      state_master: {
        Row: {
          city_id: number
          city_name: string
          created_at: string
          created_date: string | null
          id: string
          updated_at: string
        }
        Insert: {
          city_id: number
          city_name: string
          created_at?: string
          created_date?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          city_id?: number
          city_name?: string
          created_at?: string
          created_date?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_admit_cards: {
        Row: {
          batch: string | null
          course_name: string
          created_at: string
          exam_center_address: string | null
          exam_center_code: string | null
          exam_date: string | null
          exam_duration: string | null
          exam_start_time: string | null
          fathers_name: string | null
          gate_closing_time: string | null
          id: string
          mothers_name: string | null
          pwd_status: string | null
          reporting_time: string | null
          roll_number: string
          status: string | null
          student_id: string
          student_name: string
          student_photo_url: string | null
          updated_at: string
        }
        Insert: {
          batch?: string | null
          course_name: string
          created_at?: string
          exam_center_address?: string | null
          exam_center_code?: string | null
          exam_date?: string | null
          exam_duration?: string | null
          exam_start_time?: string | null
          fathers_name?: string | null
          gate_closing_time?: string | null
          id?: string
          mothers_name?: string | null
          pwd_status?: string | null
          reporting_time?: string | null
          roll_number: string
          status?: string | null
          student_id: string
          student_name: string
          student_photo_url?: string | null
          updated_at?: string
        }
        Update: {
          batch?: string | null
          course_name?: string
          created_at?: string
          exam_center_address?: string | null
          exam_center_code?: string | null
          exam_date?: string | null
          exam_duration?: string | null
          exam_start_time?: string | null
          fathers_name?: string | null
          gate_closing_time?: string | null
          id?: string
          mothers_name?: string | null
          pwd_status?: string | null
          reporting_time?: string | null
          roll_number?: string
          status?: string | null
          student_id?: string
          student_name?: string
          student_photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      student_data: {
        Row: {
          course_category: string
          created_at: string
          details: string
          id: string
          photo_url: string | null
          publish_date: string
          title: string
          updated_at: string
        }
        Insert: {
          course_category: string
          created_at?: string
          details: string
          id?: string
          photo_url?: string | null
          publish_date: string
          title: string
          updated_at?: string
        }
        Update: {
          course_category?: string
          created_at?: string
          details?: string
          id?: string
          photo_url?: string | null
          publish_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          city: string | null
          course_name: string | null
          created_at: string
          email: string
          enrollment_date: string | null
          full_name: string
          id: string
          phone: string | null
          state: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          course_name?: string | null
          created_at?: string
          email: string
          enrollment_date?: string | null
          full_name: string
          id?: string
          phone?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          course_name?: string | null
          created_at?: string
          email?: string
          enrollment_date?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_assignments: {
        Row: {
          assignment_id: string
          created_at: string
          feedback: string | null
          grade: number | null
          id: string
          status: string | null
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          feedback?: string | null
          grade?: number | null
          id?: string
          status?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          feedback?: string | null
          grade?: number | null
          id?: string
          status?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_assignments_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_courses: {
        Row: {
          completed_lessons: number | null
          course_id: string
          created_at: string
          enrolled_at: string
          id: string
          progress: number | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_lessons?: number | null
          course_id: string
          created_at?: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_lessons?: number | null
          course_id?: string
          created_at?: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          certificates_earned: number | null
          completed_courses: number | null
          created_at: string
          id: string
          last_activity: string | null
          study_streak_days: number | null
          total_courses: number | null
          total_study_hours: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certificates_earned?: number | null
          completed_courses?: number | null
          created_at?: string
          id?: string
          last_activity?: string | null
          study_streak_days?: number | null
          total_courses?: number | null
          total_study_hours?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certificates_earned?: number | null
          completed_courses?: number | null
          created_at?: string
          id?: string
          last_activity?: string | null
          study_streak_days?: number | null
          total_courses?: number | null
          total_study_hours?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          file_name: string | null
          file_size: number | null
          file_type: string | null
          id: string
          label: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          label: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          label?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      visions: {
        Row: {
          content: string
          created_at: string
          id: string
          image: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
