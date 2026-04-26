package com.eproject.petsale.common.mapper;

import com.eproject.petsale.order.entity.OrderEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderEventMapper {

    @Mapping(target = "id", expression = "java(java.util.UUID.randomUUID().toString())")
    @Mapping(target = "orderId", source = "orderId")
    @Mapping(target = "eventType", source = "toStatus") // event_type = to_status
    @Mapping(target = "fromStatus", source = "fromStatus")
    @Mapping(target = "toStatus", source = "toStatus")
    @Mapping(target = "actorId", source = "actorId")
    @Mapping(target = "actorRole", source = "actorRole")
    @Mapping(target = "payload", source = "payload")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    OrderEvent toEvent(
            Long orderId,
            String fromStatus,
            String toStatus,
            Long actorId,
            String actorRole,
            String payload
    );
}