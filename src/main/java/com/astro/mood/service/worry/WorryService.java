package com.astro.mood.service.worry;

import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.entity.worry.Worry;
import com.astro.mood.data.repository.auth.AuthRepository;
import com.astro.mood.data.repository.worry.WorryRepository;
import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.web.dto.worry.WorryDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional(readOnly = true)
public class WorryService {

    private final WorryRepository worryRepository;
    private final AuthRepository authRepository;  // authRepository 추가-userIdx를 받아오기 위해

    public WorryService(WorryRepository worryRepository, AuthRepository authRepository) {
        this.worryRepository = worryRepository;
        this.authRepository = authRepository;
    }

    // 고민글 작성
    @Transactional
    public WorryDto.Response createWorry(WorryDto.CreateRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new RuntimeException("인증된 사용자를 찾을 수 없습니다.");
        }

        // CustomUserDetails에서 사용자 IDX추출
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer userIdx = userDetails.getUserIdx();

        // userIdx로 db에서 User 엔티티 조회
        User user = authRepository.findById(userIdx)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

        // Worry 엔티티 생성 및 저장
        Worry worry = Worry.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .viewCount(0)
                .isResolved(false)
                .user(user)  // 사용자 설정
                .build();

        Worry saved = worryRepository.save(worry);
        return WorryDto.Response.fromEntity(saved);
    }

    //게시글 상세 보기
    @Transactional
    public WorryDto.Response getWorryByIdx(Integer idx) {
        Worry worry = worryRepository.findById(idx)
                .orElseThrow(() -> new RuntimeException("Worry not found"));
        // 조회 시 조회수 증가
        worry.setViewCount(worry.getViewCount() + 1);
        worryRepository.save(worry);
        return WorryDto.Response.fromEntity(worry);
    }

    // 모든 고민글 보기
    public List<WorryDto.Response> getAllWorries() {
        List<Worry> worries = worryRepository.findAll();
        return worries.stream()
                .map(WorryDto.Response::fromEntity)
                .collect(Collectors.toList());
    }
    // 고민글 수정
    @Transactional
    public WorryDto.Response updateWorry(Integer worryIdx, WorryDto.UpdateRequest request) {
        Worry worry = worryRepository.findById(worryIdx)
                .orElseThrow(() -> new RuntimeException("Worry not found"));

        //제목 내용 업데이트
        worry.setTitle(request.getTitle());
        worry.setContent(request.getContent());
        //isResolved가 null이 아닌 경우에만 업데이트
        if (request.getIsResolved() != null) {
            worry.setIsResolved(request.getIsResolved());
        }

        worryRepository.save(worry);

        return WorryDto.Response.fromEntity(worry);
    }

    // 고민글 삭제
    @Transactional
    public void deleteWorry(Integer worryIdx) {
        Worry worry = worryRepository.findById(worryIdx)
                .orElseThrow(() -> new RuntimeException("Worry not found"));
        worryRepository.delete(worry);
    }

    //resolve 처리
    @Transactional
    public WorryDto.Response changeResolveStatus(Integer worryIdx, WorryDto.ResolveChangeRequest request) {
        Worry worry = worryRepository.findById(worryIdx)
                .orElseThrow(() -> new RuntimeException("해당 고민글을 찾을 수 없습니다."));
        worry.setIsResolved(request.getIsResolved());
        worryRepository.save(worry); // 상태 저장
        return WorryDto.Response.fromEntity(worry);
    }

}
