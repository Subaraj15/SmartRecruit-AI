//package com.ai.smartrecruit.Repository;
//
//import com.ai.smartrecruit.Model.Job;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//public interface JobRepository extends JpaRepository<Job,Long> {
//}
//
//



//package com.ai.smartrecruit.Repository;
//
//import com.ai.smartrecruit.Model.Job;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//
//public interface JobRepository extends JpaRepository<Job, Long> {
//
//    List<Job> findByRecruiter_Id(Long recruiterId);
//}

package com.ai.smartrecruit.Repository;

import com.ai.smartrecruit.Model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiter_Id(Long recruiterId);
}